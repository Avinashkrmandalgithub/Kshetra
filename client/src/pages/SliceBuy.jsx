import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/UI/Button";
import { ShoppingCart, User, MapPin, Tag, IndianRupee } from "lucide-react";
import contract from "../contracts/LandRegistry.sol/AllLandRegistry.json";
import { ethers } from "ethers";
const SliceBuy = () => {
  // 1. Mock Data (Context/API se replace hoga)
  const [marketplaceAssets, setmarketplaceAssets] = useState([
    {
      id: 1,
      owner: "Avinash Kr Mandal",
      plotNo: "B-204/L",
      area: "200 Sq Ft (Slice)",
      location: "Sector 12, Pune",
      price: "12,50,000", // ₹ 12.5 Lakhs
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      owner: "Rajesh Kumar",
      plotNo: "H-45",
      area: "0.1 Acres",
      location: "New Town, WB",
      price: "45,00,000", // ₹ 45 Lakhs
      image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      owner: "Priya Singh",
      plotNo: "Z-99",
      area: "500 Sq Ft",
      location: "Banjara Hills, HYD",
      price: "85,75,000", // ₹ 85.75 Lakhs
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200",
    }
  ]);
  useState(() => {
    const fecthalldata = async () => {
      const infuraProvider = new ethers.JsonRpcProvider(
        import.meta.env.VITE_INFURA_URL
      );
      const Landcontratcget = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_DEPOLY_ADDRESS,
        contract.abi,
        infuraProvider
      );


      const depocontract = await Landcontratcget.filters.SaveLandRegistry();
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
        setmarketplaceAssets(parsedAssets)

      }
    }

 fecthalldata();
  }, [])


  // 2. Buy Handler Logic
  const handleBuy = (asset) => {
    console.log("==== 🛒 INITIATING PURCHASE ====");
    console.log("Asset ID:", asset.id);
    console.log("Owner Name:", asset.owner);
    console.log("Price to Pay: ₹", asset.price);
    alert(`Initiating secure payment for Plot ${asset.plotNo}.\nAmount: ₹${asset.price}\nPlease confirm in your UPI/Bank Gateway.`);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit'] flex flex-col">
      <Navbar />

      <main className="grow p-6 md:p-12 lg:p-20">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="mb-12 border-b-8 border-black pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="inline-block bg-[#D02020] text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-xs mb-4 shadow-[3px_3px_0px_0px_black]">
                Fractional Land Market
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                Trade <span className="text-[#1040C0]">Land.</span>
              </h1>
            </div>
            <div className="max-w-xs text-right">
              <p className="font-bold uppercase text-sm text-gray-500 leading-tight mb-2">
                Secure Indian Real Estate on a Decentralized Ledger.
              </p>
              <span className="bg-[#F0C020] px-3 py-1 border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_black]">
                Currency: INR (₹)
              </span>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_black] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121212] text-white uppercase tracking-[0.2em] text-xs">
                  <th className="p-6 border-r border-white/20">Property Asset</th>
                  <th className="p-6 border-r border-white/20">Ownership</th>
                  <th className="p-6 border-r border-white/20 text-center">Valuation</th>
                  <th className="p-6 text-center">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black">
                {marketplaceAssets.map((item,i) => (
                  <tr key={i} className="hover:bg-[#F0C020]/5 transition-colors group">

                    {/* Column 1: Asset Info */}
                    <td className="p-6 border-r-4 border-black">
                      <div className="flex items-center gap-5">
                        <div className="w-24 h-24 border-4 border-black shrink-0 overflow-hidden bg-gray-100 rotate-2 group-hover:rotate-0 transition-transform">
                          <img src={item.image} alt="land" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="font-black text-2xl uppercase leading-none mb-2">{item.plotNo}</p>
                          <div className="flex items-center gap-1 text-xs font-black text-[#1040C0] uppercase tracking-tighter">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Owner & Area */}
                    <td className="p-6 border-r-4 border-black">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#121212] border-2 border-white rounded-none flex items-center justify-center text-white">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-black uppercase text-sm tracking-tight">{item.ownerName}</span>
                        </div>
                        <div className="inline-block bg-[#F0C020]/20 border-2 border-black px-3 py-1 text-[10px] font-black uppercase">
                          Area: {item.area}
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Price in INR */}
                    <td className="p-6 border-r-4 border-black text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-3xl font-black tracking-tighter">
                          <span className="text-sm mr-1">₹</span>
                          $120000
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Incl. Registration Tax</span>
                      </div>
                    </td>

                    {/* Column 4: Buy Button */}
                    <td className="p-6 text-center">
                      <button
                        onClick={() => handleBuy(asset)}
                        className="bg-[#1040C0] text-white border-4 border-black px-8 py-4 font-black uppercase tracking-widest text-sm shadow-[6px_6px_0px_0px_#D02020] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 mx-auto active:bg-[#121212]"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Acquire Asset
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats - Updated for INR */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-4 border-black font-black uppercase flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">Live Listings</span>
              <span className="text-3xl">03 Assets</span>
            </div>
            <div className="bg-[#F0C020] p-6 border-4 border-black font-black uppercase flex flex-col items-center">
              <span className="text-xs text-[#121212]/50 mb-1">Total Marketplace Value</span>
              <span className="text-3xl">₹ 1.43 Cr</span>
            </div>
            <div className="bg-[#D02020] text-white p-6 border-4 border-black font-black uppercase flex flex-col items-center">
              <span className="text-xs text-white/50 mb-1">Security Protocol</span>
              <span className="text-3xl tracking-tighter italic">L-Chain v1</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SliceBuy;
