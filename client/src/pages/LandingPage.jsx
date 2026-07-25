import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/UI/Button.jsx";
import { Link } from "react-router";

const FeatureCard = ({ title, description, badgeColor, shape }) => {
  return (
    <div className="bg-white border-4 border-[#121212] p-8 shadow-[8px_8px_0px_0px_#121212] hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group flex flex-col h-full">
      {/* Decorative Geometric Corner */}
      <div className="absolute top-4 right-4 w-8 h-8 flex justify-center items-center z-10">
        {shape === "circle" && (
          <div
            className={`w-full h-full rounded-full ${badgeColor} border-2 border-[#121212] group-hover:scale-110 transition-transform`}
          ></div>
        )}
        {shape === "square" && (
          <div
            className={`w-full h-full rounded-none ${badgeColor} border-2 border-[#121212] group-hover:scale-110 transition-transform`}
          ></div>
        )}
        {shape === "triangle" && (
          <div
            className={`w-full h-full ${badgeColor} border-[#121212] group-hover:scale-110 transition-transform`}
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              borderBottom: "4px solid #121212",
            }}
          ></div>
        )}
      </div>

      <h3 className="text-3xl font-black uppercase tracking-tight mb-4 pr-10 text-[#121212] leading-[1.1] font-['Outfit'] relative z-20">
        {title}
      </h3>
      <p className="text-lg font-medium text-[#121212]/80 leading-relaxed font-['Outfit'] grow relative z-20">
        {description}
      </p>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#121212] font-['Outfit'] overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="grow">
        <header className="flex flex-col lg:flex-row min-h-[85vh] border-b-4 border-[#121212]">
          {/* Left Typography Panel */}
          <div className="w-full lg:w-1/1 p-8 md:p-16 lg:pl-24 xl:pl-32 flex flex-col justify-center bg-[#F0F0F0] relative items-center lg:items-start">
            <div className="w-full max-w-xl">
              <div className="inline-block bg-[#F0C020] border-4 border-[#121212] px-4 py-1 mb-8 w-max shadow-[4px_4px_0px_0px_#121212]">
                <span className="font-bold tracking-widest uppercase text-sm">
                  Govt. Backed Web3 Protocol
                </span>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
                Decentralize <br />
                <span className="text-[#D02020]">Your Land</span> <br />
                Registry.
              </h1>

              <p className="text-xl font-medium max-w-md mb-10 border-l-4 border-[#1040C0] pl-6 py-2">
                Tamper-proof, transparent, and legally binding property records
                powered by Ethereum and Aadhaar verification.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* Navigation Added to Buttons */}
                <Button
                  variant="primary"
                  onClick={() => navigate("/verify-aadhaar")}
                >
                  Register Property
                </Button>
                <Button
                  variant="yellow"
                  onClick={() => navigate("/check-assets")}
                >
                  Check your assets
                </Button>
              </div>
            </div>
          </div>

          {/* Right Geometric Art Panel */}
          <div className="w-full lg:w-[45%] bg-[#1040C0] border-t-4 lg:border-t-0 lg:border-l-4 border-[#121212] relative overflow-hidden flex items-center justify-center p-12 lg:pr-24 xl:pr-32 min-h-[50vh]">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(#F0F0F0 3px, transparent 3px)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute top-10 right-10 w-64 h-64 bg-[#F0C020] rounded-full border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] z-10 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#121212] transition-all duration-300"></div>
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#D02020] rotate-12 border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] z-20 hover:rotate-6 transition-all duration-300"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-72 bg-white border-4 border-[#121212] shadow-[12px_12px_0px_0px_#121212] z-30 flex flex-col p-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="h-1/2 w-full bg-[#121212] mb-4 flex items-center justify-center">
                  <div className="text-[#F0F0F0] font-black tracking-widest uppercase text-xl">
                    Block #8492
                  </div>
                </div>
                <div className="w-full h-4 bg-[#E0E0E0] mb-2 border-2 border-[#121212]"></div>
                <div className="w-3/4 h-4 bg-[#E0E0E0] mb-2 border-2 border-[#121212]"></div>
                <div className="w-full h-4 bg-[#E0E0E0] border-2 border-[#121212]"></div>
              </div>
            </div>
          </div>
        </header>

        {/* --- FEATURES SECTION --- */}
        <section className="bg-[#F0C020] py-24 px-8 md:px-16 lg:px-24 border-b-4 border-[#121212]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-[#121212] pb-6">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                The Architecture <br /> of{" "}
                <span
                  className="text-white"
                  style={{ textShadow: "4px 4px 0 #121212" }}
                >
                  Trust
                </span>
              </h2>
              <p className="text-xl font-bold uppercase mt-6 md:mt-0 pb-2">
                Core Technologies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              <FeatureCard
                title="Solidity Smart Contracts"
                description="Business logic is hardcoded into immutable Solidity contracts. Land minting, transferring, and fractional ownership are executed automatically."
                badgeColor="bg-[#1040C0]"
                shape="square"
              />
              <FeatureCard
                title="Aadhaar Sandbox API"
                description="Zero-knowledge KYC integration. We use the Aadhaar Sandbox API to verify owner identities securely."
                badgeColor="bg-[#D02020]"
                shape="circle"
              />
              <FeatureCard
                title="IPFS Metadata Storage"
                description="Legal documents and maps are hashed and stored on IPFS, ensuring records are permanent and tamper-proof."
                badgeColor="bg-white"
                shape="triangle"
              />
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="bg-[#D02020] py-32 px-8 border-b-4 border-[#121212] relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-96 h-96 border-12 border-[#121212] rounded-full opacity-20"></div>
          <div className="absolute -left-10 -bottom-20 w-72 h-72 border-12 border-[#121212] rotate-45 opacity-20"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10 bg-white p-10 md:p-16 border-4 border-[#121212] shadow-[16px_16px_0px_0px_#121212]">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Ready to Mint Your Land?
            </h2>
            <p className="text-xl md:text-2xl font-medium mb-10 text-[#121212]/80 max-w-2xl mx-auto">
              Connect your MetaMask, verify your identity, and digitize your
              real estate assets today.
            </p>
            {/* Navigation on Bottom CTA */}
            <Button
              variant="secondary"
              className="text-xl py-4 px-12"
              onClick={() => navigate("/submit-blockchain")}
            >
              Enter App
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
