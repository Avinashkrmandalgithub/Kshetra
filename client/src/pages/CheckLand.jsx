import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/UI/Button";
import { Search, MapPin, Maximize2, FileText, LayoutGrid, Award, Download } from "lucide-react";
import { ethers, keccak256, toUtf8Bytes } from "ethers";
import contract from "../contracts/LandRegistry.sol/AllLandRegistry.json";
import childContract from "../contracts/LandRegistry.sol/LandRegistry.json";
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const decodeCoordinate = (encodedPoint) => {
  const encoded = BigInt(encodedPoint.toString());
  const lat = Number(encoded / 1_000_000_000n) / 1_000_000 - 90;
  const lng = Number(encoded % 1_000_000_000n) / 1_000_000 - 180;
  return [lat, lng];
};

const formatCoordinate = ([lat, lng]) => `(${lat.toFixed(5)}, ${lng.toFixed(5)})`;

const createPointIcon = (pointNumber) =>
  L.divIcon({
    className: "land-point-marker",
    html: `<div style="width:34px;height:34px;border:3px solid #121212;background:#F0C020;color:#121212;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;box-shadow:3px 3px 0 #121212;">P${pointNumber}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });

function BoundaryMap({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [28, 28], maxZoom: 18 });
    }
  }, [map, points]);

  return null;
}
const CheckLand = () => {
  const [aadhaarQuery, setAadhaarQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [assets, setAssets] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // Helper to fetch logs in max 10,000 block ranges
  // Add this simple sleep helper
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getLogsInChunks = async (contractInstance, filter, startBlock, endBlock) => {
    const CHUNK_SIZE = 9900;
    let allEvents = [];

    for (let currentFrom = startBlock; currentFrom <= endBlock; currentFrom += CHUNK_SIZE) {
      const currentTo = Math.min(currentFrom + CHUNK_SIZE - 1, endBlock);

      // Fetch the chunk
      const chunkEvents = await contractInstance.queryFilter(filter, currentFrom, currentTo);
      allEvents = allEvents.concat(chunkEvents);

      // Tell the loop to wait 300 milliseconds before making the next request
      await sleep(300);
    }

    return allEvents;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (aadhaarQuery.length !== 12) return alert("Enter valid 12-digit ID");

    setIsSearching(true);

    try {
      const infuraProvider = new ethers.JsonRpcProvider(import.meta.env.VITE_INFURA_URL);
      const factoryContract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_DEPOLY_ADDRESS,
        contract.abi,
        infuraProvider
      );

      const searchHash = keccak256(toUtf8Bytes(aadhaarQuery));

      // 1. Fetch ALL properties created on the platform
      const allPropertiesFilter = await factoryContract.filters.SaveLandRegistry();
      const latestBlock = await infuraProvider.getBlockNumber();
      const DEPLOY_BLOCK = Number(import.meta.env.VITE_CONTRACT_DEPLOY_BLOCK || 0);

      const allEvents = await getLogsInChunks(factoryContract, allPropertiesFilter, DEPLOY_BLOCK, latestBlock);
      const relatedAssets = [];

      // 2. Loop through properties and check their LIVE state
      await Promise.all(allEvents.map(async (e) => {
        const raw = e.args;
        const registryWallet = raw[11];
        const originalCreatorHash = raw[1];

        // Connect to the specific property contract
        const childContractInstance = new ethers.Contract(registryWallet, childContract.abi, infuraProvider);

        // Fetch LIVE state from the blockchain
        const liveAadhaarHash = await childContractInstance.AadhaarHash();
        const liveFullName = await childContractInstance.FullName();
        const liveOwnerWallet = await childContractInstance.Owner();

        // 3. Determine relationship to the searched ID
        // Do they own it right now?
        const isCurrentlyOwned = liveAadhaarHash === searchHash;

        // Did they create it, but no longer own it?
        const wasOriginalCreator = originalCreatorHash === searchHash;

        // If they currently own it OR they used to own it, show it to them
        if (isCurrentlyOwned || wasOriginalCreator) {
          const boundaryPoints = [raw[2], raw[3], raw[4], raw[5]].map(decodeCoordinate);

          relatedAssets.push({
            isCurrentlyOwned,                // Boolean flag to drive the UI
            currentOwnerName: liveFullName,  // The TRUE current owner
            currentOwnerWallet: liveOwnerWallet,
            boundaryPoints,
            plotNo: boundaryPoints.map((point, idx) => `P${idx + 1}: ${formatCoordinate(point)}`).join(" | "),
            price: ethers.formatEther(raw[6]),
            area: raw[7],
            location: raw[8],
            image: `https://amber-wonderful-kite-814.mypinata.cloud/ipfs/${raw[9]}`,
            registryWallet: registryWallet,
          });
        }
      }));

      setAssets(relatedAssets);

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch records. Check console.");
    } finally {
      setIsSearching(false);
    }
  };
  // Helper function to force download from IPFS without opening a new tab
  const handleDownloadImage = async (imageUrl, plotNo) => {
    try {
      setIsDownloading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Deed_Plot_${plotNo}.jpg`; // Generates a clean filename
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Could not download image. IPFS Gateway might be blocking cross-origin requests.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit'] flex flex-col">
      <Navbar />

      <main className="grow p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* SEARCH SECTION */}
          <section className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              Explore <span className="text-[#1040C0]">Ledger.</span>
            </h1>

            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4"
            >
              <div className="relative grow group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-black z-10" />
                <input
                  type="text"
                  maxLength={12}
                  placeholder="Enter 12-Digit Number"
                  value={aadhaarQuery}
                  onChange={(e) =>
                    setAadhaarQuery(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full pl-14 pr-6 py-5 border-4 border-black bg-white text-xl font-black focus:outline-none focus:bg-[#F0C020]/10 transition-all shadow-[8px_8px_0px_0px_black] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[10px_10px_0px_0px_black]"
                  required
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                className="md:w-48 text-xl py-5 shadow-[8px_8px_0px_0px_black]"
              >
                {isSearching ? "..." : "Search"}
              </Button>
            </form>
          </section>

          {/* ASSETS DISPLAY GRID */}
          {assets && assets.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                <LayoutGrid className="w-8 h-8 text-[#D02020]" />
                <h2 className="text-3xl font-black uppercase tracking-tight">
                  Official Deeds ({assets.length})
                </h2>
              </div>

              {/* Dynamic Grid: Centers 1 record, Grids 2+ records */}
              <div className={`grid gap-12 ${assets.length === 1
                ? "grid-cols-1 max-w-2xl mx-auto"
                : "grid-cols-1 lg:grid-cols-2"
                }`}>
                {assets.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#FFFFF4] border-4 border-black shadow-[16px_16px_0px_0px_black] flex flex-col relative"
                  >
                    {/* DEED HEADER */}
                    <div className="bg-[#1040C0] text-white p-4 border-b-4 border-black flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-[#F0C020]" />
                        <h3 className="text-2xl font-black uppercase tracking-widest">Title Deed</h3>
                      </div>
                      <span className="bg-[#F0C020] text-black border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_black]">
                        VERIFIED ON-CHAIN
                      </span>
                    </div>

                    {/* PROPERTY IMAGE WITH DOWNLOAD BUTTON */}
                    {/* PROPERTY IMAGE WITH CONDITIONAL SOLD OVERLAY */}
                    <div className="h-64 border-b-4 border-black p-4 bg-white flex justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">

                      {/* 🛑 NEW: SOLD BANNER OVERLAY 🛑 */}
                      {!item.isCurrentlyOwned && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[120%] bg-[#D02020] text-white py-4 px-8 border-y-8 border-black text-center transform -rotate-12 shadow-[8px_8px_0px_0px_black] backdrop-blur-sm bg-opacity-95">
                          <p className="text-5xl font-black uppercase tracking-[0.2em] leading-none mb-1 shadow-black drop-shadow-md">
                            Asset Sold
                          </p>
                          <p className="text-sm font-bold uppercase tracking-widest bg-black text-[#F0C020] inline-block px-3 py-1 border-2 border-[#F0C020]">
                            Transferred To: {item.currentOwnerName}
                          </p>
                        </div>
                      )}

                      <div className={`w-full h-full border-4 border-black shadow-[8px_8px_0px_0px_#D02020] relative overflow-hidden group ${!item.isCurrentlyOwned ? 'opacity-40 grayscale' : ''}`}>
                        <img
                          src={item.image}
                          alt="Property"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 border-4 border-black pointer-events-none"></div>
                      </div>

                      {/* Only allow downloads if they currently own it */}
                      {item.isCurrentlyOwned && (
                        <button
                          onClick={() => handleDownloadImage(item.image, item.plotNo)}
                          disabled={isDownloading}
                          className="absolute bottom-6 right-6 bg-[#F0C020] text-black p-3 border-4 border-black hover:bg-white transition-all shadow-[6px_6px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_black] z-10 flex items-center justify-center group disabled:bg-gray-400 disabled:cursor-not-allowed"
                          title="Download Property Image"
                        >
                          {isDownloading ? (
                            <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* LAND BOUNDARY MAP */}
                    <div className="border-b-4 border-black bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-widest text-[#1040C0]">
                          Boundary Visualization
                        </p>
                        <span className="bg-[#F0C020] border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_black]">
                          {item.boundaryPoints.length}/4 Points
                        </span>
                      </div>

                      <div className="h-72 overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_#121212]">
                        <MapContainer
                          center={item.boundaryPoints[0] || [22.273, 85.96]}
                          zoom={17}
                          scrollWheelZoom={false}
                          doubleClickZoom={false}
                          dragging={true}
                          style={{ height: "100%", width: "100%" }}
                          className="z-0"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          />

                          <BoundaryMap points={item.boundaryPoints} />

                          {item.boundaryPoints.map((point, pointIndex) => (
                            <Marker
                              key={pointIndex}
                              position={point}
                              icon={createPointIcon(pointIndex + 1)}
                            >
                              <Popup>
                                <div className="font-sans text-xs font-bold text-[#121212]">
                                  <strong>Point {pointIndex + 1}</strong>
                                  <br />
                                  {formatCoordinate(point)}
                                </div>
                              </Popup>
                            </Marker>
                          ))}

                          {item.boundaryPoints.length > 1 && (
                            <Polygon
                              positions={item.boundaryPoints}
                              pathOptions={{
                                color: "#1040C0",
                                fillColor: "#F0C020",
                                fillOpacity: 0.35,
                                weight: 3,
                              }}
                            />
                          )}
                        </MapContainer>
                      </div>
                    </div>

                    {/* DEED DATA */}
                    <div className="p-6 flex flex-col gap-6 grow">
                      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_black]">
                        <p className="text-xs font-black uppercase tracking-widest text-[#D02020] mb-1">
                         {item.ownerName?"Registered Owner":"Current Owner"}
                        </p>
                        <p className="text-4xl font-black uppercase truncate">
                          {item.ownerName?item.ownerName:item.currentOwnerName }
                        </p>
                      </div>

                      <div className="grid grid-cols-2 border-4 border-black divide-x-4 divide-black bg-white">
                        <div className="p-4 flex flex-col justify-center border-b-4 border-black col-span-2 md:col-span-1 md:border-b-0">
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Plot / Survey No.</p>
                          <p className="text-2xl font-bold">{item.plotNo}</p>
                        </div>
                        <div className="p-4 flex flex-col justify-center border-b-4 border-black col-span-2 md:col-span-1 md:border-b-0">
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Area Details</p>
                          <p className="text-2xl font-bold">{item.area}</p>
                        </div>
                        <div className="p-4 col-span-2 border-t-4 border-black flex items-center gap-3">
                          <MapPin className="w-6 h-6 text-[#1040C0] shrink-0" />
                          <div>
                            <p className="text-[10px] font-black uppercase text-gray-500">Location</p>
                            <p className="text-lg font-bold uppercase">{item.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 bg-gray-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_black]">
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Owner Wallet Address</p>
                          <p className="text-xs font-mono bg-white border-2 border-black p-2 truncate">
                            {item.ownerWallet?item.ownerWallet:item.currentOwnerWallet}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Registry Authority</p>
                          <p className="text-xs font-mono bg-white border-2 border-black p-2 truncate">
                            {item.registryWallet}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-5 bg-[#121212] text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-[#D02020] transition-colors border-t-4 border-black flex justify-center items-center gap-2">
                      <FileText className="w-5 h-5" />
                      View Immutable Record
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : assets && assets.length === 0 ? (
            <div className="py-20 text-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_black]">
              <p className="text-xl font-bold text-[#D02020] uppercase tracking-widest">
                No Records Found for this ID.
              </p>
            </div>
          ) : (
            !isSearching && (
              <div className="py-20 text-center border-4 border-dashed border-black bg-white/50">
                <p className="text-xl font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Enter ID to scan Decentralized Records
                </p>
              </div>
            )
          )}

          {isSearching && (
            <div className="py-20 flex flex-col items-center">
              <div className="w-16 h-16 border-8 border-black border-t-[#F0C020] rounded-none animate-spin mb-4 shadow-[4px_4px_0px_0px_black]" />
              <p className="font-black uppercase animate-pulse tracking-widest">
                Syncing with Nodes...
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckLand;

