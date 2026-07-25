import React, { useState } from "react";
import { useNav } from "../App.jsx";
import Button from "./UI/Button.jsx";
import landchainLogo from "../assets/landchain.png";
import { ethers } from "ethers";

export default function Navbar() {
  const { navigateWithLoader } = useNav();
  
  // Wallet State
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // MetaMask Connection Logic
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask or a Web3 wallet extension.');
        setIsConnecting(false);
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const fullAddress = accounts[0];
      const showAddress = `${fullAddress.slice(0, 4)}...${fullAddress.slice(-4)}`;
      setAddress(showAddress);
      
      // Fetch Balance
      const eth_bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [fullAddress, 'latest']
      });
      
      const fullBal = ethers.formatEther(eth_bal);
      // Slice to 6 characters (e.g., "0.0123")
      const showBal = fullBal.slice(0, 6); 
      setBalance(showBal);
      
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 md:px-8 md:py-6 border-b-4 border-[#121212] bg-white sticky top-0 z-50">
      {/* Logo Area */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigateWithLoader("/")}
      >
        <div className="p-0.75 rounded-xl bg-gradient-to-tr from-[#D02020] via-[#F0C020] to-[#1040C0] transition-transform duration-300 group-hover:scale-105 shadow-[4px_4px_0px_0px_#121212]">
          <div className="bg-[#121212] rounded-lg overflow-hidden flex items-center justify-center p-1 md:p-1.5">
            <img
              src={landchainLogo}
              alt="LandChain Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>
        </div>

        <span className="text-3xl font-black tracking-tighter uppercase ml-2 font-['Outfit'] text-[#121212]">
          LandChain
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 items-center font-['Outfit']">

         <button
          onClick={() => navigateWithLoader("/")}
          className="font-bold uppercase tracking-widest text-[#121212] hover:text-[#1040C0] transition-colors cursor-pointer border-none bg-transparent"
        >
          Home
        </button>
         <button
          onClick={() => navigateWithLoader("/check-assets")}
          className="font-bold uppercase tracking-widest text-[#121212] hover:text-[#1040C0] transition-colors cursor-pointer border-none bg-transparent"
        >
          Check Assets
        </button>
        <button
          onClick={() => navigateWithLoader("/verify-aadhaar")}
          className="font-bold uppercase tracking-widest text-[#121212] hover:text-[#D02020] transition-colors cursor-pointer border-none bg-transparent"
        >
          Verify Identity
        </button>
        <button
          onClick={() => navigateWithLoader("/slice-buy")}
          className="font-bold uppercase tracking-widest text-[#121212] hover:text-[#D02020] transition-colors cursor-pointer border-none bg-transparent"
        >
          Sclice and Buy
        </button>

        {/* Conditional Wallet Button / Info Badge */}
        {address && balance ? (
          <div className="flex items-center bg-[#F0C020] border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#121212]">
            <div className="px-3 py-2 bg-white border-r-4 border-[#121212] font-black font-mono text-sm">
              {balance} ETH
            </div>
            <div className="px-3 py-2 font-black font-mono text-sm text-[#121212] uppercase">
              {address}
            </div>
          </div>
        ) : (
          <Button variant="primary" onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="p-2 border-4 border-[#121212] bg-[#F0C020] shadow-[4px_4px_0px_0px_#121212] hover:bg-[#F0C020]/90 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}