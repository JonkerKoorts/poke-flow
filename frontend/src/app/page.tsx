import HomeContent from "@/components/home/home-content";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0B0F2F] via-[#111C44] to-[#0B0F2F]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA]"></div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
