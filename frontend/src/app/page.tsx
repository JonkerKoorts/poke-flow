import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <p className="text-xs font-thin tracking-wider -ml-24">Welcome to</p>
        <h1 className="text-4xl uppercase font-semibold">Poke-Flow</h1>
      </div>
      <Link href={"/element"} className="mt-5 underline text-blue-400">
        Let&apos;s go!
      </Link>
    </div>
  );
}
