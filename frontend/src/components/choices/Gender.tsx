"use client";

import { fetchPokemonByGender } from "@/lib/services/api.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
    <div className="flex justify-center items-center gap-10">
      <button
        onClick={() => handleChooseGender("male")}
        disabled={isLoading}
        className={`px-6 py-2 rounded-lg transition-all duration-200 
          ${
            isLoading && selectedGender === "male"
              ? "bg-blue-400 cursor-not-allowed"
              : isLoading
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
          } text-white font-medium`}
      >
        {isLoading && selectedGender === "male" ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          "Male"
        )}
      </button>
      <button
        onClick={() => handleChooseGender("female")}
        disabled={isLoading}
        className={`px-6 py-2 rounded-lg transition-all duration-200 
          ${
            isLoading && selectedGender === "female"
              ? "bg-blue-400 cursor-not-allowed"
              : isLoading
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
          } text-white font-medium`}
      >
        {isLoading && selectedGender === "female" ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          "Female"
        )}
      </button>
    </div>
  );
};

export default Gender;
