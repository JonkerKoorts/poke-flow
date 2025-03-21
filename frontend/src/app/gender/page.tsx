import React, { Suspense } from "react";
import Gender from "@/components/choices/Gender";

const GenderPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <p className="text-xs font-thin tracking-wider -ml-24">
          Please choose:
        </p>
        <h1 className="text-4xl uppercase font-semibold">Gender</h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Gender />
      </Suspense>
    </div>
  );
};

export default GenderPage;
