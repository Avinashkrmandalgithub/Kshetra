import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/UI/Button";
import { Search, MapPin, Maximize2, FileText, LayoutGrid, Award, Download } from "lucide-react";
import { ethers, keccak256, toUtf8Bytes } from "ethers";
import contract from "../contracts/LandRegistry.sol/AllLandRegistry.json";

const CheckLand = () => {
  const [aadhaarQuery, setAadhaarQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [assets, setAssets] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (aadhaarQuery.length !== 12)
      return alert("Enter valid 12-digit ID");

    setIsSearching(true);

    try {
      const infuraProvider = new ethers.JsonRpcProvider(
        import.meta.env.VITE_INFURA_URL
      );
      const Landcontratcget = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_DEPOLY_ADDRESS,
        contract.abi,
        infuraProvider
      );

      const hashedId = keccak256(toUtf8Bytes(aadhaarQuery));

      const depocontract = await Landcontratcget.filters.SaveLandRegistry(null, hashedId);
      const event = await Landcontratcget.queryFilter(depocontract);

      if (event.length > 0) {
        const parsedAssets = event.map((e) => {
          const raw = e.args;
          return {
            ownerName: raw[0],
            hashedId: raw[1],
            plotNo: Number(raw[2]).toString(),
            area: raw[3],
            location: raw[4],
            image: `https://amber-wonderful-kite-814.mypinata.cloud/ipfs/${raw[5]}`,
            ownerWallet: raw[6],
            registryWallet: raw[7],
          };
        });

        setAssets(parsedAssets);
      } else {
        setAssets([]);
      }
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
                    <div className="h-64 border-b-4 border-black p-4 bg-white flex justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
                      <div className="w-full h-full border-4 border-black shadow-[8px_8px_0px_0px_#D02020] relative overflow-hidden group">
                        <img
                          src={item.image}
                          alt="Property"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 border-4 border-black pointer-events-none"></div>
                      </div>

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
                    </div>

                    {/* DEED DATA */}
                    <div className="p-6 flex flex-col gap-6 grow">
                      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_black]">
                        <p className="text-xs font-black uppercase tracking-widest text-[#D02020] mb-1">
                          Registered Owner
                        </p>
                        <p className="text-4xl font-black uppercase truncate">
                          {item.ownerName}
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
                            {item.ownerWallet}
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