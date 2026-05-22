"use client";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { FaIndustry, FaBalanceScale, FaBullhorn, FaFlask, FaShoppingCart, FaChartLine } from "react-icons/fa";

/* ================= HERO IMAGES (STATIC) ================= */

export default function Services() {
    const services = [
        {
            title: "Beverage Manufacturing",
            description:
                "End-to-end production of matcha mixes, herbal teas, coffee drinks, and traditional beverage blends.",
            icon: <FaIndustry size={28} />,
        },
        {
            title: "Quality & Compliance",
            description:
                "Support for FSSAI-ready processes, labels, batch documentation, and export-friendly standards.",
            icon: <FaBalanceScale size={28} />,
        },
        {
            title: "Branding & Packaging",
            description:
                "Shelf-ready identity, pouches, tins, sachets, cafe packs, and launch positioning.",
            icon: <FaBullhorn size={28} />,
        },
        {
            title: "Custom Formulations",
            description:
                "Matcha, hojicha, kahwa, iced tea, masala chai, and wellness blends tailored to your brand.",
            icon: <FaFlask size={28} />,
        },
        {
            title: "Cafe & Retail Support",
            description:
                "Drink formats designed for cafes, D2C brands, quick commerce, gifting, and retail shelves.",
            icon: <FaShoppingCart size={28} />,
        },
        {
            title: "Launch Strategy",
            description:
                "Practical planning for pricing, sampling, product formats, and repeat-purchase growth.",
            icon: <FaChartLine size={28} />,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            <main className="flex-grow">

                {/* ================= HERO SECTION ================= */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6">

                        <h2 className="text-4xl font-bold text-center text-[#244332] mb-4">
                            Our Services
                        </h2>

                        <p className="text-center text-gray-600 mb-12">
                            Helping brands create, launch, and grow successful matcha and traditional drink products.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2"
                                >
                                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#244332] text-[#ffffff] mb-4">
                                        {service.icon}
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}


