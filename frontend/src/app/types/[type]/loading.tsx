export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#0B0F2F] min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3B4CCA]"></div>
      <p className="mt-4 text-neutral-300">Loading...</p>
    </div>
  );
}
