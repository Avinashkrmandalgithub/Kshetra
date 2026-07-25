import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/UI/Button.jsx";
import { useVerifyData } from "../contaxts/verifyDataContext.jsx";
import data from "../Mocdata/LandOwner.json";
import { useNavigate } from "react-router-dom";

export default function LandVerify() {
  const { verifyData: initialVerifyData, setVerifyData: setInitialVerifyData } = useVerifyData();
  // 1. Mock Context Data
  const mockContextUser = {
    fullName: initialVerifyData.name,
    address: initialVerifyData.address,
    walletAddress: "0x71C...9A23",
  };

  // 2. States
  const [verifyData, setVerifyData] = useState({
    PlotNumber: "",
    area: "",
    Location: "",
  });
  const [verifyStatus, setVerifyStatus] = useState("idle"); // "idle" | "verifying" | "verified"

  // Always show masked format with last 4 digits (Mocked for UI)
  const maskedAadhaar = initialVerifyData.aadhaar;

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerifyData({ ...verifyData, [name]: value });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifyStatus("verifying");
    console.log(initialVerifyData.aadhaar, verifyData);
    const user = data.find((item) => {
      console.log(item.AadhaarHash, initialVerifyData.aadhaar);
      return item.AadhaarHash === initialVerifyData.aadhaar;
    });

    if (!user) {
      console.log("❌ Aadhaar not found");
      setVerifyStatus("idle");
      return;
    }

    const isMatch =
      user.PlotNumber === Number(verifyData.PlotNumber) &&
      user.area.trim().toLowerCase() === verifyData.area.trim().toLowerCase() &&
      user.Location.trim().toLowerCase() === verifyData.Location.trim().toLowerCase();

    if (isMatch) {
      console.log("✅ Land Verified:", user);
      setVerifyStatus("verified");
    } else {
      console.log("❌ Land details do not match");
      setVerifyStatus("idle");
    }

    setInitialVerifyData((prev) => ({ ...prev, ...verifyData }));

    console.log({ user, verifyData })

  };

  const navigate = useNavigate()
  const handleSubmitToBlockchain = () => {
    navigate('/submit-blockchain')
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit'] flex flex-col">
      <Navbar />

      <main className="grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl bg-white border-4 border-[#121212] shadow-[12px_12px_0px_0px_#121212] relative overflow-hidden">
          {/* Header Strip */}
          <div className="bg-[#F0C020] p-6 border-b-4 border-[#121212] flex flex-col md:flex-row justify-between items-center text-[#121212]">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                Verify Land Record
              </h1>
              <p className="font-bold tracking-widest uppercase text-sm mt-1 border-l-4 border-[#121212] pl-2">
                Blockchain Query System
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white border-4 border-[#121212] px-4 py-2 shadow-[4px_4px_0px_0px_#121212]">
              <div className="w-3 h-3 rounded-none bg-[#1040C0] animate-pulse"></div>
              <span className="font-bold font-mono text-sm tracking-wider uppercase">
                Node Synced
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Step 1: Pre-filled Context Data */}
            <div className="mb-10 bg-[#F0F0F0] p-6 border-4 border-[#121212] relative">
              <div className="absolute -top-4 left-4 bg-[#1040C0] text-white px-4 py-1 border-4 border-[#121212] font-black uppercase text-sm shadow-[4px_4px_0px_0px_#121212]">
                Verified Context Data
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Name */}
                <div>
                  <p className="font-black uppercase tracking-tight text-[#121212]/60 text-sm mb-1">
                    Owner Name
                  </p>
                  <p className="font-bold text-xl uppercase">
                    {mockContextUser.fullName}
                  </p>
                </div>

                {/* Masked ID (Always Hidden) */}
                <div>
                  <p className="font-black uppercase tracking-tight text-[#121212]/60 text-sm mb-1">
                    Identity Number
                  </p>
                  <p className="font-bold text-xl tracking-widest">
                    {maskedAadhaar}
                  </p>
                </div>

                {/* Full Address */}
                <div className="md:col-span-2 border-t-2 border-[#121212]/20 pt-4">
                  <p className="font-black uppercase tracking-tight text-[#121212]/60 text-sm mb-1">
                    Registered Address
                  </p>
                  <p className="font-bold text-lg">{mockContextUser.address}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Land Details Form */}
            {verifyStatus !== "verified" ? (
              <form onSubmit={handleVerify} className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Plot Number */}
                  <div className="flex flex-col">
                    <label className="text-xl font-black uppercase tracking-tight mb-2">
                      Plot / Survey No.
                    </label>
                    <input
                      type="text"
                      name="PlotNumber"
                      placeholder="e.g. S-124/B"
                      value={verifyData.PlotNumber}
                      onChange={handleChange}
                      required
                      disabled={verifyStatus === "verifying"}
                      className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#1040C0] transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Area - Updated to accept text and units */}
                  <div className="flex flex-col">
                    <label className="text-xl font-black uppercase tracking-tight mb-2">
                      Target Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      placeholder="e.g. 2400 Sq Ft or 2.5 Acres"
                      value={verifyData.area}
                      onChange={handleChange}
                      required
                      disabled={verifyStatus === "verifying"}
                      className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#1040C0] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-10">
                  <label className="text-xl font-black uppercase tracking-tight mb-2">
                    Property Location to Verify
                  </label>
                  <textarea
                    name="Location"
                    placeholder="Enter complete address..."
                    value={verifyData.Location}
                    onChange={handleChange}
                    required
                    rows="2"
                    disabled={verifyStatus === "verifying"}
                    className="p-4 border-4 border-[#121212] bg-[#F0F0F0] font-medium focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#F0C020] transition-all resize-none disabled:opacity-50"
                  ></textarea>
                </div>

                <Button
                  variant="secondary"
                  className={`w-full text-xl py-5 flex justify-center items-center gap-3 transition-all ${verifyStatus === "verifying" ? "opacity-80 cursor-wait" : ""}`}
                  type="submit"
                  disabled={verifyStatus === "verifying"}
                >
                  {verifyStatus === "verifying" ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Querying Blockchain...
                    </>
                  ) : (
                    "Verify Land Details"
                  )}
                </Button>
              </form>
            ) : (
              /* --- VERIFIED RESULT UI --- */
              <div className="border-4 border-green-600 bg-green-50 p-8 text-center relative animate-fade-in shadow-[8px_8px_0px_0px_#16a34a]">
                <div className="w-20 h-20 bg-green-500 border-4 border-[#121212] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#121212]">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter text-green-800 mb-2">
                  Record Verified!
                </h2>

                {/* Emphasize that the owner is the current user */}
                <div className="bg-green-600 text-white inline-block px-4 py-1 border-2 border-[#121212] mb-6 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#121212]">
                  The Owner Is YOU
                </div>

                <div className="bg-white border-4 border-[#121212] p-4 text-left max-w-md mx-auto mb-8">
                  <div className="flex justify-between border-b-2 border-gray-200 pb-2 mb-2">
                    <span className="font-bold text-gray-500 uppercase text-sm">Status</span>
                    <span className="font-black text-green-600 uppercase">Tamper-Proof</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-gray-200 pb-2 mb-2">
                    <span className="font-bold text-gray-500 uppercase text-sm">Plot No.</span>
                    <span className="font-black text-[#121212] uppercase">{verifyData.PlotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500 uppercase text-sm">Owner Match</span>
                    <span className="font-black text-[#1040C0] uppercase">{mockContextUser.fullName}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {/* Main Action: Submit to Blockchain */}
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto text-lg py-3 px-8"
                    onClick={handleSubmitToBlockchain}
                  >
                    Submit to Blockchain
                  </Button>

                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
