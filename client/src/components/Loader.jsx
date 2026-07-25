import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 bg-[#F0F0F0] flex flex-col items-center justify-center overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#D02020] opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-[#1040C0] opacity-20 rotate-45 animate-bounce"></div>

      {/* Main Animated Bauhaus Loader */}
      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 bg-[#D02020] border-4 border-[#121212] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-12 h-12 bg-[#F0C020] border-4 border-[#121212] animate-spin [animation-duration:3s]"></div>
        <div
          className="w-12 h-12 bg-[#1040C0] border-[#121212]"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            borderBottom: "4px solid #121212",
          }}
        ></div>
      </div>

      <h2 className="mt-8 text-2xl font-black uppercase tracking-[0.3em] text-[#121212] animate-pulse">
        Syncing Ledger...
      </h2>

      {/* Bauhaus Line */}
      <div className="mt-4 w-48 h-2 bg-[#121212] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F0C020] w-1/2 animate-[loading_1.5s_infinite_ease-in-out]"></div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `,
        }}
      />
    </div>
  );
}
