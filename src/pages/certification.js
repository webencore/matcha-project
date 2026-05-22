"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IoCloseCircle } from "react-icons/io5";

export default function Home() {
  const certificate_images = [
    { src: "/Images/certificates/ISO-9001.png", name: "ISO 9001" },
    { src: "/Images/certificates/GMP.png", name: "GMP" },
    { src: "/Images/certificates/HCCP.png", name: "HACCP" },
    { src: "/Images/certificates/NOIDA-FSSAI.png", name: "FSSAI" }
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseZoom = () => {
    setSelectedImageIndex(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start p-8">
        <div className="text-black font-serif w-full">
          <h1 className="text-black text-center font-serif text-4xl mb-12 ml-4">
            Certification
          </h1>

          <div className="w-full overflow-hidden py-4 border-y border-gray-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {certificate_images.map((image, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center bg-white"
                  onClick={() => handleImageClick(index)}
                >
                  {/* Image Container */}
                  <div className="w-full aspect-[3/4] overflow-hidden rounded-md relative bg-gray-100">
                    <Image
                      src={image.src}
                      alt={image.name}
                      fill
                      className="object-contain transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 50vw,
                 33vw"
                    />
                  </div>

                  {/* Image Title */}
                  <div className="w-full mt-3 text-center font-medium text-white bg-[#28a745] py-2 rounded-b-md text-sm sm:text-base">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>


            {/* Zoom modal (client-side only) */}
            {isClient && selectedImageIndex !== null && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-90 overflow-auto p-8 flex items-start justify-center">
                <button
                  onClick={handleCloseZoom}
                  className="h-auto w-auto fixed top-4 right-4 p-2 rounded-full text-[#ff0303] hover:scale-90 transition-all focus:outline-none z-50"
                >
                  <IoCloseCircle className="text-4xl" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[90%] h-[90vh]">
                    <Image
                      src={certificate_images[selectedImageIndex].src}
                      alt="Zoomed-in certificate"
                      fill
                      sizes="90vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
