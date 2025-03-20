import Link from "next/link";
import React from "react";

const GenderPage = () => {
  // use server here to get data and use a suspense boundary to render it

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <p className="text-xs font-thin tracking-wider -ml-24">
          Please choose:
        </p>
        <h1 className="text-4xl uppercase font-semibold">Gender</h1>
      </div>
      <div className="flex justify-center items-center gap-10">
        <Link href={"/gender/male"} className="mt-5 underline text-blue-400">
          Male
        </Link>
        <Link href={"/gender/female"} className="mt-5 underline text-blue-400">
          Female
        </Link>
      </div>
    </div>
  );
};

export default GenderPage;
