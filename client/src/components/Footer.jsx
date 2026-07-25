import React from "react";
import landchainLogo from "../assets/landchain.png";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white p-8 md:p-16 font-['Outfit'] border-t-8 border-[#F0C020]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Left Side: Branding & About */}
          <div className="max-w-sm">
            <div className="flex items-center gap-4 mb-6 group cursor-default">
              {/* Navbar jaisa Gradient Logo Wrapper */}
              <div className="p-0.5 rounded-lg bg-linear-to-tr from-[#D02020] via-[#F0C020] to-[#1040C0]">
                <div className="bg-[#121212] rounded-md p-1.5 flex items-center justify-center">
                  <img
                    src={landchainLogo}
                    alt="LandChain Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter text-[#F0F0F0]">
                LandChain
              </span>
            </div>
            <p className="text-[#F0F0F0]/60 font-medium leading-relaxed uppercase text-sm tracking-wider">
              Securing the world's real estate on the immutable ledger.
              Transparent. Decentralized. Legal.
            </p>
          </div>

          {/* Right Side: Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#F0C020] font-black uppercase tracking-widest text-xs">
                Protocol
              </h4>
              <a
                href="#"
                className="hover:text-[#D02020] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                Smart Contracts
              </a>
              <a
                href="#"
                className="hover:text-[#D02020] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                Whitepaper
              </a>
              <a
                href="#"
                className="hover:text-[#D02020] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                Github
              </a>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1040C0] font-black uppercase tracking-widest text-xs">
                Community
              </h4>
              <a
                href="#"
                className="hover:text-[#F0C020] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                Discord
              </a>
              <a
                href="#"
                className="hover:text-[#F0C020] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                X / Twitter
              </a>
              <a
                href="#"
                className="hover:text-[#F0C020] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                Medium
              </a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#D02020] font-black uppercase tracking-widest text-xs">
                Devs
              </h4>
              <a
                href="#"
                className="hover:text-[#1040C0] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                Sandbox API
              </a>
              <a
                href="#"
                className="hover:text-[#1040C0] transition-colors font-bold uppercase text-sm tracking-tight"
              >
                IPFS Docs
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Legal & Status */}
        <div className="pt-8 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-white/5 border border-white/20 text-[10px] font-black uppercase tracking-widest text-[#F0C020]">
              Mainnet Live: v1.0.4
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} LANDCHAIN PROTOCOL INC.
            </p>
          </div>

          <div className="flex gap-8 items-center text-[10px] font-black uppercase tracking-widest text-white/40">
            <span className="cursor-pointer hover:text-white transition-colors">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-white transition-colors">
              Terms of Service
            </span>
            <div className="flex items-center gap-2 text-[#D02020]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D02020] animate-pulse"></div>
              <span>Network: Sepolia Testnet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
