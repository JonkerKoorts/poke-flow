"use client";

import { fetchPokemonByGender } from "@/lib/services/api.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";

const Gender = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);

  const handleChooseGender = async (gender: "male" | "female") => {
    setIsLoading(true);
    setSelectedGender(gender);
    const data = await fetchPokemonByGender(gender);
    if (data) {
      router.push(
        `/gender/${gender}?data=${encodeURIComponent(JSON.stringify(data))}`
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center gap-6 mt-8">
      <Button
        onClick={() => handleChooseGender("male")}
        disabled={isLoading}
        variant="outline"
        className={`px-6 py-3 text-lg font-extrabold tracking-widest uppercase transition-all duration-300 border-2 rounded-xl ${
          isLoading && selectedGender === "male"
            ? "bg-[#3B4CCA] cursor-not-allowed"
            : isLoading
            ? "bg-gray-200 cursor-not-allowed"
            : "border-[#3B4CCA] text-[#3B4CCA] hover:bg-[#3B4CCA] hover:text-white hover:shadow-[0_0_30px_#3B4CCA]"
        }`}
      >
        {isLoading && selectedGender === "male" ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          "Male"
        )}
      </Button>
      <Button
        onClick={() => handleChooseGender("female")}
        disabled={isLoading}
        variant="outline"
        className={`px-6 py-3 text-lg font-extrabold tracking-widest uppercase transition-all duration-300 border-2 rounded-xl ${
          isLoading && selectedGender === "female"
            ? "bg-[#3B4CCA] cursor-not-allowed"
            : isLoading
            ? "bg-gray-200 cursor-not-allowed"
            : "border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:shadow-[0_0_30px_#FF0000]"
        }`}
      >
        {isLoading && selectedGender === "female" ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          "Female"
        )}
      </Button>
    </div>
  );
};

export default Gender;
