"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from 'next/image';
import { FaInstagram } from "react-icons/fa";
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';
import { GoArrowUpRight } from "react-icons/go";
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from "framer-motion";
import { FaIndustry, FaBalanceScale, FaBullhorn, FaFlask, FaShoppingCart, FaChartLine } from "react-icons/fa";

import "leaflet/dist/leaflet.css";

//-------------------------------------------------------------
const ImageGallery = ({ images = [] }) => {
  const galleryItems = Array.isArray(images) ? images : [];
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <section className="w-full bg-gray-50 py-6 px-4">

      {/* Loading */}
      {galleryItems.length === 0 && (
        <p className="text-center text-gray-500">Loading images...</p>
      )}

      {/* Grid with scroll */}
      <div className="max-h-[500px] overflow-y-auto pt-2 sm:p-3 md:p-15">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-2">
          {galleryItems.map((img, index) => (
            <div
              key={index}
              className="relative w-full h-32 sm:h-36 md:h-40 cursor-pointer overflow-hidden"
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={img.src}
                alt={img.name || "gallery"}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          {/* Close */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            <IoClose />
          </button>

          {/* Prev */}
          <button
            onClick={() =>
              setSelectedIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
            }
            className="absolute left-5 text-white text-4xl"
          >
            <IoChevronBack />
          </button>

          {/* Image */}
          <div className="relative w-[90vw] max-w-4xl h-[70vh]">
            <Image
              src={galleryItems[selectedIndex].src}
              alt="preview"
              fill
              unoptimized
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          <button
            onClick={() =>
              setSelectedIndex((prev) => (prev + 1) % galleryItems.length)
            }
            className="absolute right-5 text-white text-4xl"
          >
            <IoChevronForward />
          </button>

        </div>
      )}
    </section>
  );
};

const services = [
  {
    icon: <FaIndustry size={28} />,
    number: "01",
    title: "Beverage Manufacturing",
    desc: "End-to-end production of matcha mixes, herbal teas, coffee drinks, and traditional beverage blends.",
  },
  {
    icon: <FaBalanceScale size={28} />,
    number: "02",
    title: "Quality & Compliance",
    desc: "Support for FSSAI-ready processes, batch documentation, labels, and export-friendly standards.",
  },
  {
    icon: <FaBullhorn size={28} />,
    number: "03",
    title: "Branding & Packaging",
    desc: "Shelf-ready identity, pouches, tins, sachets, cafe packs, and launch positioning.",
  },
  {
    icon: <FaFlask size={28} />,
    number: "04",
    title: "Custom Formulations",
    desc: "Matcha, hojicha, kahwa, iced tea, masala chai, and wellness blends tailored to your audience.",
  },
  {
    icon: <FaShoppingCart size={28} />,
    number: "05",
    title: "Cafe & Retail Support",
    desc: "Product formats designed for cafes, D2C brands, quick commerce, gifting, and retail shelves.",
  },
  {
    icon: <FaChartLine size={28} />,
    number: "06",
    title: "Launch Strategy",
    desc: "Practical planning for pricing, formats, sampling, and repeat-purchase growth.",
  },
];

const ServiceCard = ({ icon, number, title, desc }) => {
  return (
    <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none p-5 md:p-0 shadow-sm md:shadow-none transition-all duration-300 hover:scale-[1.02]">

      <div className="flex items-center mb-3">
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-[#244332] text-xl">
          {icon}
        </div>
        <span className="text-sky-500 font-semibold text-xl sm:text-2xl ml-3">
          {number}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#10294b] mb-1">
        {title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

//---------------------------------------------------------------------------

export default function Home() {
  const [activeCard, setActiveCard] = useState(null);
  const handleCardClick = (cardId) => {
    // Toggle the overlay on mobile
    setActiveCard((prev) => (prev === cardId ? null : cardId));
  };

  // ===================================================================================================================
  const cards = [
    {
      id: 1, name: "MATCHA & JAPANESE DRINKS", small_desc: "Ceremonial-style matcha, hojicha, latte mixes, and cafe-ready beverage bases.", img: "/Images/Home/card1.jpg" },
    { id: 2, name: "TRADITIONAL INDIAN DRINKS", small_desc: "Kahwa, masala chai, kadha, sherbet-inspired blends, and wellness infusions.", img: "/Images/Home/card2.jpg" },
    { id: 3, name: "COFFEE & MODERN BLENDS", small_desc: "Cold coffee, flavoured coffee, functional mixes, and everyday premium drinks.", img: "/Images/Home/card3.jpg" },
  ];

  const certificate_images = [
    { src: "/Images/certificates/logos/FSSAI-LOGO.png", alt: "Image 1", certificate: "/Images/certificates/NOIDA-FSSAI.png" },
    { src: "/Images/certificates/logos/GMP_LOGO.png", alt: "Image 2", certificate: "/Images/certificates/GMP.png" },
    { src: "/Images/certificates/logos/HACCP-LOGO.jpg", alt: "Image 3", certificate: "/Images/certificates/HCCP.png" },
    { src: "/Images/certificates/logos/ISO-9001.png", alt: "Image 4", certificate: "/Images/certificates/ISO-9001.png" },
  ];

  const [currentCertificateIndex_unique, setCurrentCertificateIndex_unique] = useState(0);

  // Auto change every 3 seconds
  useEffect(() => {
    const interval_unique = setInterval(() => {
      setCurrentCertificateIndex_unique((prevIndex) =>
        prevIndex === certificate_images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval_unique);
  }, [certificate_images.length]);


  // Click to open full certificate
  const handleCertificateClick_unique = () => {
    const selected = certificate_images[currentCertificateIndex_unique];
    window.open(selected.certificate, "_blank");
  };
  // ===============================================================================================================================
  const reel = [
    { src: "Videos/video1.mp4", instagramLink: "https://www.instagram.com/reel/DSsK-CrEh2i/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "Videos/video2.mp4", instagramLink: "https://www.instagram.com/reel/DP6UlyrCc3s/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "Videos/video3.mp4", instagramLink: "https://www.instagram.com/reel/DCVepFcPSQr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "Videos/video4.mp4", instagramLink: "https://www.instagram.com/reel/C_PZoHTxfbp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "Videos/video5.mp4", instagramLink: "https://www.instagram.com/reel/C-sWja-odp9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "Videos/video6.mp4", instagramLink: "https://www.instagram.com/reel/C7Qy9e7Ipp1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
  ]

  // --- Ayurvedic ---
  const herbal_teas = [
    { img: "/Images/industy_serve/herbal_tea/wellness-and-functional-tea.jpeg", name: "Matcha Latte Mixes", desc: "Classic matcha latte, vanilla matcha, jaggery matcha, iced matcha, and cafe-ready premixes." },
    { img: "/Images/industy_serve/herbal_tea/floral-herbal-tea.jpeg", name: "Japanese Tea Blends", desc: "Hojicha, genmaicha-inspired blends, jasmine green tea, floral green tea, and light daily infusions." },
    { img: "/Images/industy_serve/herbal_tea/Classic-Herbal-Tea.jpeg", name: "Traditional Chai", desc: "Masala chai, kadak chai, Kashmiri kahwa, spiced black tea, and regional Indian tea blends." },
    { img: "/Images/industy_serve/herbal_tea/herbal-healing-tea.jpeg", name: "Herbal Wellness Drinks", desc: "Tulsi, mulethi, moringa, turmeric ginger, kadha-style blends, and functional wellness cups." },
    { img: "/Images/industy_serve/herbal_tea/Fruity-Herbal-Tea.jpeg", name: "Iced Tea & Fruit Beverages", desc: "Peach, apple cinnamon, lemon honey, pineapple ginger, hibiscus, and refreshing modern drink blends." },
    { img: "/Images/industy_serve/herbal_tea/Premium-Tea.jpeg", name: "Premium Tea Formats", desc: "Ceremonial-style matcha, culinary matcha, white tea blends, sachets, tins, and bulk foodservice packs." },
  ];
  const [activeIndexht, setActiveIndexht] = useState(0);

  // --- Cosmetics ---
  const coffees = [
    { img: "/Images/industy_serve/coffees/Falvoured-Loose-coffee..jpeg", name: "Flavoured Coffee Mixes", desc: "Hazelnut, caramel, vanilla, cardamom, almond, mocha, and cafe-style cold coffee bases." },
    { img: "/Images/industy_serve/coffees/Loose-Coffee-Blends.jpeg", name: "Functional Coffee Blends", desc: "Coffee with ashwagandha, turmeric, spices, dates, no-added-sugar formats, and wellness positioning." },
    { img: "/Images/industy_serve/coffees/Coffee-Beans.jpeg", name: "Coffee Packs", desc: "Loose coffee, bean bags, sachets, and bulk formats for retail or cafe use." },
  ];
  const [activeIndexcoffes, setActiveIndexcoffes] = useState(0);

  // --- Ingredients ---
  const ingredient_seasonings = [
    { img: "/Images/industy_serve/sesonings/Flakes-Seasoning-images.jpeg", name: "Kahwa & Spiced Drinks", desc: "Saffron kahwa, cinnamon-cardamom blends, dry fruit notes, and warming traditional drink mixes." },
    { img: "/Images/industy_serve/sesonings/Blended-Seasoning.jpeg", name: "Summer Drink Bases", desc: "Aam panna-style, jaljeera-inspired, rose, lemon, and herbal cooler formats for modern shelves." },
    { img: "/Images/industy_serve/sesonings/Spices-Mix.jpeg", name: "Custom Spice Drink Mixes", desc: "Masala milk, turmeric latte, ginger blends, and regional recipes adapted for private label brands." },
  ];
  const [activeIndexseasonings, setActiveIndexseasonings] = useState(0);

  //---------------------------------------------------


  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setGalleryImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();
  }, []);

  //---------------------------------------------------

  // ========================================================================================================================
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-start">
        <div className="relative w-full h-[100vh]">
          {/* Background Image */}
          <Image
            src="/Images/Infusion-banner.jpeg"
            alt="Poster"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-start bg-black/40 px-4 sm:px-8 md:px-12 pt-10 sm:pt-16 md:pt-20">
            <motion.div
              className="text-white w-full sm:w-[85%] md:w-[65%] lg:w-[55%] text-left"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-['Georgia',serif] font-bold mb-3 sm:mb-4 leading-snug">
                Matcha, Japanese Beverages & Traditional Drinks, Crafted Right
              </h3>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-gray-100 pr-2 sm:pr-4 md:pr-6 font-['Georgia',serif]">
                Partner with{" "}
                <span className="font-semibold text-[#f4d36b] font-['Georgia',serif]">
                  DS Baverages
                </span>{" "}
                for matcha, tea, coffee, and traditional beverage solutions designed for modern brands.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="relative w-full bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-10">
          {/* Scrollable cards */}
          <div className="relative py-10">
            {/* Heading */}
            <div className="mb-10 text-center px-4">
              <h2 className="font-extrabold text-[#b8872b] font-serif tracking-widest">
                Product Categories
              </h2>

              <h1 className="text-xl sm:text-2xl font-serif text-gray-900 mt-2">
                Explore Our Wide Range Of{" "}
                <span className="text-[#244332]">matcha, traditional drinks & modern blends</span>
              </h1>

              <h1 className="text-xl sm:text-2xl font-serif text-[#244332] mt-1">
                from Japanese calm to Indian tradition
              </h1>
            </div>

            {/* Cards Container */}
            <div className="w-full px-6">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                  >
                    {/* Image */}
                    <Image
                      src={card.img}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 390px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Always visible title */}
                    <div className="absolute bottom-4 left-0 w-full text-center text-white z-10">
                      <h3 className="text-sm sm:text-base font-bold uppercase font-serif">
                        {card.name}
                      </h3>
                    </div>

                    {/* Overlay */}
                    <div
                      className={`absolute bottom-0 left-0 w-full p-5 text-center text-white bg-black/80 flex flex-col items-center justify-center transition-all duration-300 z-20
                ${activeCard === card.id
                          ? "translate-y-0 opacity-100"
                          : "translate-y-full opacity-0"
                        }
                md:group-hover:translate-y-0 md:group-hover:opacity-100`}
                    >
                      <h3 className="text-sm sm:text-base font-bold uppercase font-serif">
                        {card.name}
                      </h3>

                      <p className="text-xs mt-2 uppercase opacity-90 font-serif">
                        {card.small_desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="mt-6 w-full flex flex-col sm:flex-row justify-between gap-3">
            <a
              href={`/contact`}
              className="font-serif flex-1 inline-flex items-center justify-between border border-[#244332] text-[#244332] px-6 py-3 rounded-md text-base font-medium transition-all duration-300 hover:bg-[#244332] hover:text-white hover:shadow-lg"
            >
              Matcha Beverage Catalogue
              <GoArrowUpRight />
            </a>
            <a
              href={`/contact`}
              className="font-serif flex-1 inline-flex items-center justify-between border border-[#244332] text-[#244332] px-6 py-3 rounded-md text-base font-medium transition-all duration-300 hover:bg-[#244332] hover:text-white hover:shadow-lg"
            >
              Private Label Enquiry
              <GoArrowUpRight />
            </a>
          </div>
        </div>

        <div className="bg-[#edf6ec] w-full py-12 px-4 md:py-16 md:px-6">
          <div className="max-w-7xl mx-auto text-start">
            {/* first row */}
            {/* Steps Section */}
            <div className="bg-[#edf6ec] w-full py-12 px-4 md:py-16 md:px-6">
              <div className="max-w-7xl mx-auto text-start">

                {/* Header */}
                <div className="flex flex-col md:flex-row w-full items-start md:items-center">

                  {/* Left */}
                  <div className="w-full md:w-[70%] p-2 md:p-4">
                    <h4 className="text-[#b8872b] font-semibold mb-2 text-base md:text-lg">
                      End-to-End Beverage Solutions for Your Brand
                    </h4>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#10294b] leading-snug">
                      Your Trusted Partner in{" "}
                      <span className="text-[#244332]">Matcha</span>
                    </h2>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#10294b] leading-snug">
                      <span className="text-[#244332]">and Drink Development</span>
                    </h2>
                  </div>

                  {/* Button */}
                  <div className="w-full md:w-[30%] p-2 md:p-4 mt-4 md:mt-0">
                    <div className="flex justify-start md:justify-end">
                      <button className="bg-[#244332] hover:scale-105 text-white font-medium px-5 py-2.5 rounded-full flex items-center gap-2 text-sm transition-all duration-200">
                        Partner With Us
                        <span className="bg-white w-6 h-6 flex items-center justify-center rounded-full">
                          <GoArrowUpRight className="text-[#244332] text-sm" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {services.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* Matcha Section */}
          <h2 className="text-center text-2xl font-bold mt-10 text-black">Matcha & Japanese Beverages</h2>
          <div className="flex w-[95%] mx-auto h-80 gap-3 mt-5 overflow-hidden rounded-xl">
            {herbal_teas.map((item, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out cursor-pointer ${activeIndexht === index ? "flex-[3]" : "flex-[1]"
                  }`}
                onClick={() => setActiveIndexht(index)}
              >
                <Image src={item.img} alt={`Gallery ${index}`} fill sizes="(max-width: 768px) 95vw, 32vw" className="object-cover" />
                {activeIndexht === index && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4 transition-opacity duration-500">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm mt-1">{item.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Traditional Section */}
          <h2 className="text-center text-2xl font-bold mt-10 text-black">Coffee & Modern Beverage Blends</h2>
          <div className="flex w-[95%] mx-auto h-80 gap-3 mt-5 overflow-hidden rounded-xl">
            {coffees.map((item, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out cursor-pointer ${activeIndexcoffes === index ? "flex-[3]" : "flex-[1]"
                  }`}
                onClick={() => setActiveIndexcoffes(index)}
              >
                <Image src={item.img} alt={`Gallery ${index}`} fill sizes="(max-width: 768px) 95vw, 32vw" className="object-cover" />
                {activeIndexcoffes === index && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4 transition-opacity duration-500">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm mt-1">{item.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Traditional Drinks Section */}
          <h2 className="text-center text-2xl font-bold mt-10 text-black">Traditional Drink Mixes</h2>
          <div className="flex w-[95%] mx-auto h-80 gap-3 mt-5 overflow-hidden rounded-xl">
            {ingredient_seasonings.map((item, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out cursor-pointer ${activeIndexseasonings === index ? "flex-[3]" : "flex-[1]"
                  }`}
                onClick={() => setActiveIndexseasonings(index)}
              >
                <Image src={item.img} alt={`Gallery ${index}`} fill sizes="(max-width: 768px) 95vw, 32vw" className="object-cover" />
                {activeIndexseasonings === index && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4 transition-opacity duration-500">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm mt-1">{item.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* certificate Section */}
        <div className="mt-3 flex flex-col w-full">

          {/* Heading */}
          <div className="w-full p-4 text-center">
            <h2 className="font-extrabold text-[#b8872b] font-serif tracking-widest mt-3 md:mt-5">
              Our Certifications
            </h2>

            <h1 className="text-lg sm:text-xl md:text-3xl font-serif text-gray-900 leading-tight">
              Ensuring Quality, Purity & Compliance{" "}
              <span className="text-[#244332]">Across Global</span>
            </h1>

            <h1 className="text-lg sm:text-xl md:text-3xl font-serif text-[#244332] mb-4 md:mb-5">
              Standards
            </h1>
          </div>

          {/* Certificates Grid */}
          <div className="w-full flex justify-center px-4 pb-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">

              {certificate_images.map((item, index) => (
                <div
                  key={index}
                  onClick={() => window.open(item.certificate, "_blank")}
                  className="relative 
                     w-[150px] h-[100px] 
                     sm:w-[220px] sm:h-[150px]
                     md:w-[260px] md:h-[180px]
                     bg-white overflow-hidden cursor-pointer 
                     transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 150px, (max-width: 768px) 220px, 260px"
                    className="object-contain p-2"
                  />
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col md:flex-row h-auto md:h-90 w-full">
          {/* Left Column - Color */}
          <div className="w-full md:w-[45%] p-4 bg-[#e3f8f7] text-center md:text-left">
            <h2 className="font-extrabold text-[#b8872b] font-serif tracking-widest mt-2 md:mt-5 text-lg md:text-2xl">
              Photo Gallery
            </h2>

            <h1 className="text-lg sm:text-base md:text-3xl font-serif text-gray-900 leading-tight mt-2">
              A Glimpse into our World of <span className="text-[#244332]">Natural</span> &nbsp;
            </h1>

            <h1 className="text-lg sm:text-base md:text-3xl font-serif text-[#244332] mb-3 md:mb-5">
              Excellence
            </h1>
          </div>

          {/* Right Column - Text */}
          <div className="flex items-center justify-center overflow-hidden w-full md:w-[55%] md:mt-0">
            <ImageGallery images={galleryImages} />
          </div>
        </div>

        <div className="relative w-full bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-10">
          {/* Scrollable cards */}
          <div className="relative">
            {/* Heading */}
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-green-700 font-serif uppercase tracking-widest">
                Experience DS Baverages
              </h2>
            </div>


            {/* Cards Container */}
            <div
              id="scrollContainer"
              className="flex overflow-x-auto gap-6 px-6 pb-4 scrollbar-hide scroll-smooth"
            >
              {reel.length > 0 ? (
                reel.map((video, index) => (
                  <div
                    key={index}
                    className="min-w-[250px] border border-green-900 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-3 flex flex-col items-center"
                  >
                    <p className="w-full bg-green-900 rounded-lg text-white text-center font-serif mb-1">
                      {video.alt}
                    </p>
                    <video
                      src={video.src}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-100 hover:scale-102 rounded-lg object-cover"
                    />
                    <a
                      href={video.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif w-full mt-2 inline-flex items-center justify-between border border-green-900 text-green-900 px-6 py-3 rounded-md text-base font-medium transition-all duration-300 hover:bg-green-900 hover:text-white hover:shadow-lg"
                    >
                      <FaInstagram />
                      Instagram
                      <GoArrowUpRight />
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg w-full">
                  No testimonials available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}




