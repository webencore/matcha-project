"use client";
import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* Company Logo */}
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#244332] text-sm font-bold tracking-wide text-[#f4d36b]">
                DS
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg font-bold text-[#244332]">DS Baverages</span>
                <span className="text-xs tracking-[0.2em] text-[#b8872b]">MATCHA & TRADITIONAL DRINKS</span>
            </span>

            {/* Spinner */}
            <div className="mt-6 w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

            <p className="mt-4 text-green-700 font-semibold">
                Loading...
            </p>
        </div>
    );
}
