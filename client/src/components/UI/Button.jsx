import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
}) {
  const baseStyle =
    "px-6 py-3 font-bold uppercase tracking-wider border-4 border-[#121212] transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Outfit']";

  const variants = {
    primary:
      "bg-[#D02020] text-white shadow-[6px_6px_0px_0px_#121212] hover:bg-[#D02020]/90",
    secondary:
      "bg-[#1040C0] text-white shadow-[6px_6px_0px_0px_#121212] hover:bg-[#1040C0]/90",
    yellow:
      "bg-[#F0C020] text-[#121212] shadow-[6px_6px_0px_0px_#121212] hover:bg-[#F0C020]/90",
    outline:
      "bg-white text-[#121212] shadow-[6px_6px_0px_0px_#121212] hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
