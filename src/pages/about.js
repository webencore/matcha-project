"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from "next/image";
import { motion } from "motion/react";
import { GiChemicalDrop, GiMicroscope, GiWashingMachine, GiSlicedBread, GiManualJuicer, GiCardboardBox, GiFactory, GiCheckMark, } from "react-icons/gi";

export default function Home() {
    const steps = [
        { title: "Ingredient Sourcing", icon: <GiChemicalDrop className="w-6 h-6" /> },
        { title: "Raw Material Testing", icon: <GiMicroscope className="w-6 h-6" /> },
        { title: "Cleaning & Sorting", icon: <GiWashingMachine className="w-6 h-6" /> },
        { title: "Cutting & Sifting", icon: <GiSlicedBread className="w-6 h-6" /> },
        { title: "Blending", icon: <GiManualJuicer className="w-6 h-6" /> },
        { title: "Packaging", icon: <GiCardboardBox className="w-6 h-6" /> },
        { title: "Private Labeling", icon: <GiFactory className="w-6 h-6" /> },
        { title: "Final Quality Check & Dispatch", icon: <GiCheckMark className="w-6 h-6" /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-start p-8">
                <div className="text-black font-serif">
                    <h1 className="text-black text-center font-serif text-4xl mb-12 ml-4">About Us</h1>
                    <p>DS Baverages is a multi-category beverage partner creating matcha, Japanese-inspired drinks, herbal infusions, coffee blends, and traditional Indian drink mixes for modern brands.</p>
                </div>

                <div className="w-full">
                    <div className="mb-5 relative w-full flex flex-col items-center justify-center overflow-hidden">
                        <div className="relative flex items-center justify-center scale-[0.75] sm:scale-90 md:scale-100 origin-center transition-transform duration-300">
                            <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                                <div className="absolute w-32 h-32 md:w-36 md:h-36 bg-white text-white flex flex-col items-center justify-center rounded-full text-center font-semibold shadow-lg hover:scale-110 transition-transform gap-2 border border-[#244332] border-4">
                                    <Image
                                        src="/Images/logo2.png"
                                        width={60}
                                        height={60}
                                        alt="Center Logo"
                                    />
                                    <span className="bg-[#244332] bg-clip-text text-transparent">
                                        Beverage Process
                                    </span>
                                </div>

                                {steps.map((step, index) => {
                                    const angle = (index / steps.length) * 2 * Math.PI;
                                    const radius = 150;
                                    const x = radius * Math.cos(angle);
                                    const y = radius * Math.sin(angle);
                                    const rotationDeg = (angle * 180) / Math.PI + 90;

                                    return (
                                        <div
                                            key={index}
                                            className="absolute flex flex-col items-center justify-center text-center transform transition-all duration-300"
                                            style={{
                                                left: `calc(50% + ${x}px - 55px)`,
                                                top: `calc(50% + ${y}px - 55px)`,
                                            }}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.8, delay: index * 0.3 }}
                                                viewport={{ once: true }}
                                                className="relative z-[1] bg-[#244332] text-white w-[110px] h-[110px] rounded-full flex flex-col items-center justify-center shadow-md text-sm font-medium"
                                                style={{ "--rotation": `${rotationDeg}deg` }}
                                            >
                                                {step.icon}
                                                <span>{step.title}</span>
                                                <span className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 bg-white text-green-900 text-sm font-bold px-2 z-[2]">
                                                    {index + 1}
                                                </span>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-black font-serif mb-5">
                    <p>We provide everything your beverage brand needs to move from concept to a shelf-ready, cafe-ready product.</p>
                </div>

                {/* YouTube Section */}
                <div className="w-full max-w-[800px] aspect-[16/9] mx-auto">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src="https://www.youtube.com/embed/sra3gzOa0Wg"
                        title="YouTube video player"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Our Vision Section */}
                <div className="mt-12">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2 flex justify-center">
                            <Image
                                src="/Images/Aboutus/vission.jpeg"
                                alt="A visual representation of DS Baverages vision and brand strategy."
                                width={500}
                                height={400}
                                className="w-full h-auto max-w-md object-contain transition-transform duration-300 ease-in-out transform hover:scale-110 animate-pulse"
                            />
                        </div>

                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <p className="text-black font-serif text-lg leading-relaxed space-y-4">

                                <span className="block text-xl md:text-2xl font-semibold">
                                    Built to launch. Designed to scale. Designed to dominate.
                                </span>

                                <span className="block">
                                    We transform <strong>matcha, tea, coffee, and traditional drink ideas</strong> into
                                    <strong> high-impact, category-defining brands</strong>.
                                </span>

                                <span className="block">
                                    From <strong>concept to shelf to scale</strong>, every step is crafted
                                    with precision, speed, and market intelligence.
                                </span>

                                <span className="block font-medium">
                                    We do not just build products.
                                </span>

                                <span className="block text-lg font-semibold">
                                    We build brands that command attention, create demand, and lead their category.
                                </span>

                                <span className="block">
                                    With deep expertise in <strong>manufacturing, branding, and go-to-market strategy</strong>,
                                    we turn everyday consumables into powerful, scalable businesses.
                                </span>

                                <span className="block italic font-medium">
                                    Because in crowded markets, only the sharpest brands win.
                                </span>

                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <hr className="my-12 border-t-2 border-green-900" />
                </div>

                {/* Our Mission Section */}
                <div className="mt-1">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2 flex justify-center">
                            <Image
                                src="/Images/Aboutus/mission.jpeg"
                                alt="A visual representation of DS Baverages mission and brand strategy."
                                width={500}
                                height={400}
                                className="w-full h-auto max-w-lg object-contain transition-transform duration-300 ease-in-out transform hover:scale-110 animate-pulse"
                            />
                        </div>
                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <p className="text-black font-serif text-lg leading-relaxed space-y-4">

                                <span className="block text-xl md:text-2xl font-semibold">
                                    Beyond manufacturing. We build scalable brands.
                                </span>

                                <span className="block">
                                    We partner with <strong>ambitious founders</strong> to turn
                                    <strong> matcha, tea, coffee, and traditional drink ideas</strong> into
                                    <strong> high-performing brands</strong> that do not just enter the market, they <strong>take space in it</strong>.
                                </span>

                                <span className="block">
                                    From <strong>product formulation to brand positioning to go-to-market execution</strong>,
                                    every decision is driven by one goal:
                                </span>

                                <span className="block text-lg font-semibold">
                                    Speed. Scale. Sell-through.
                                </span>

                                <span className="block">
                                    We eliminate <strong>friction</strong>, cut <strong>guesswork</strong>, and replace it
                                    with systems that create <strong>demand</strong>, build <strong>trust</strong>, and
                                    drive <strong>repeat purchase</strong>.
                                </span>

                                <span className="block font-medium">
                                    Because a product in the market is easy.
                                </span>

                                <span className="block italic font-semibold">
                                    A brand that wins the market is engineered.
                                </span>

                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}


