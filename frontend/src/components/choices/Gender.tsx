"use client";

import { fetchPokemonByGender } from "@/lib/services/api.service";
import { useRouter } from "next/navigation";
import React from "react";

const Gender = () => {
  const router = useRouter();

  const handleChooseMale = async () => {
    const data = await fetchPokemonByGender("male");
    if (data) {
      router.push(
        `/gender/male?data=${encodeURIComponent(JSON.stringify(data))}`
      );
    }
  };

  const handleChooseFemale = async () => {
    const data = await fetchPokemonByGender("female");
    if (data) {
      router.push(
        `/gender/female?data=${encodeURIComponent(JSON.stringify(data))}`
      );
    }
  };

  return (
    <div className="flex justify-center items-center gap-10">
      <button
        onClick={handleChooseMale}
        className="mt-5 underline text-blue-400"
      >
        Male
      </button>
      <button
        onClick={handleChooseFemale}
        className="mt-5 underline text-blue-400"
      >
        Female
      </button>
    </div>
  );
};

export default Gender;
