import React from "react";
import Gender from "@/components/choices/Gender";

const GenderPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#111C44] to-[#0B0F2F] text-white animate-fade-in">
      {/* Title */}
      <div className="text-center mb-8">
        <p className="text-base tracking-wider uppercase text-[#FFDE00] animate-fade-in-up delay-100 font-bold">
          Please choose:
        </p>
        <h1 className="text-5xl font-black uppercase animate-fade-in-up delay-200 bg-gradient-to-r from-[#3B4CCA] via-[#FFDE00] to-[#FF0000] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Gender
        </h1>
      </div>
      {/* Gender Selection Component */}
      <Gender />
    </div>
  );
};

export default GenderPage;
