"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-start justify-end bg-cover bg-center bg-no-repeat p-8 md:p-24"
      style={{ backgroundImage: "url('/dashboard-header.png')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-3xl text-white">
        <div className="mb-4 inline-flex items-center gap-x-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="relative z-10">For coaches ready to scale with data, not hunches</span>
        </div>
        <h1 className="text-5xl font-normal tracking-tighter text-gray-200 md:text-6xl lg:text-7xl">
          Stop Guessing Which Content 
    
          <span className="ml-4 tracking-tighter italic font-thin">Converts</span>
        </h1>
        <p className="text-md mt-6 max-w-2xl text-lg leading-8 text-gray-300">
        Syntra connects your YouTube analytics to your actual revenue, showing you exactly which videos book calls and close deals.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
            <Link
                href="/dashboard"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                See How It Works
            </Link>
            <Link href="#" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
            </Link>
        </div>
      </div>
    </main>
  );
}
