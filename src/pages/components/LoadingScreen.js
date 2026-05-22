"use client";
import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* Company Logo */}
            <Image
                src="/Images/logo2.png" // ⬅️ Replace with your company logo path
                width={140}
                height={140}
                alt="Company Logo"
                className="animate-pulse"
            />


            {/* Spinner */}
            <div className="mt-6 w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

            <p className="mt-4 text-green-700 font-semibold">
                Loading...
            </p>
        </div>
    );
}
