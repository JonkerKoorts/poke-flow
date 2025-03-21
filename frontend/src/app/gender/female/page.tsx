"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const FemalePage: React.FC = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("data")
    ? JSON.parse(decodeURIComponent(searchParams.get("data")!))
    : null;

  return <div>FemalePage: {JSON.stringify(data)}</div>;
};

export default FemalePage;
