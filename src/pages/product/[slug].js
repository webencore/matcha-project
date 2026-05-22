"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import pool from "../../../lib/db";
import Image from "next/image";
import { FaFacebook, FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

// --- Product Share Component ---
function ProductShare({ product }) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(window.location.href);
        }
    }, []);

    const shareText = `Check out this product: ${product.name}`;

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + url)}`,
    };

    const handleInstagramShare = () => {
        navigator.clipboard.writeText(url);
        alert("Product link copied! You can paste it on Instagram.");
    };

    return (
        <div className="flex flex-col items-start mt-6 sm:mt-8 w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Share</h2>
            <div className="flex flex-wrap gap-4 sm:gap-6">
                {/* Facebook */}
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-blue-600 text-base sm:text-lg hover:scale-110 transition-transform"
                    title="Share on Facebook"
                >
                    <FaFacebook className="text-xl sm:text-2xl" />
                    <span className="text-gray-700 hidden sm:inline">Facebook</span>
                </a>

                {/* WhatsApp */}
                <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-green-500 text-base sm:text-lg hover:scale-110 transition-transform"
                    title="Share on WhatsApp"
                >
                    <FaWhatsapp className="text-xl sm:text-2xl" />
                    <span className="text-gray-700 hidden sm:inline">WhatsApp</span>
                </a>

                {/* Instagram */}
                <button
                    onClick={handleInstagramShare}
                    className="flex items-center gap-2 sm:gap-3 text-pink-500 text-base sm:text-lg hover:scale-110 transition-transform"
                    title="Copy link for Instagram"
                >
                    <FaInstagram className="text-xl sm:text-2xl" />
                    <span className="text-gray-700 hidden sm:inline">Instagram</span>
                </button>
            </div>
        </div>
    );
}

// --- Server Side Props ---
export async function getServerSideProps(context) {
    const { slug } = context.params;

    const [rows] = await pool.query(
        `
        SELECT 
            p.id,
            p.name,
            p.image,
            p.slug,
            p.extra_data,
            pc.name AS category_name
        FROM product p
        JOIN product_category pc ON p.product_category_id = pc.id
        WHERE p.slug = ?
        `,
        [slug]
    );

    if (rows.length === 0) {
        return { notFound: true };
    }

    if (rows.length > 0 && typeof rows[0].extra_data !== "object") {
        rows[0].extra_data = JSON.parse(rows[0].extra_data);
    }

    return {
        props: {
            product: JSON.parse(JSON.stringify(rows[0])),
        },
    };
}

// --- Product Detail Page ---
export default function ProductDetail({ product }) {
    return (
        <div>
            <Header />
            <main className="p-4 sm:p-6 bg-white min-h-screen">
                <div className="flex flex-col md:flex-row w-full gap-6 sm:gap-10 p-4 sm:p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Product Image */}
                    <div className="w-full md:w-1/3 flex justify-center items-center relative">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_AWS_URL}/hnco-infusions/products/${product.image}`}
                            width={400}
                            height={400}
                            alt={product?.name || "Product Image"}
                            className="rounded-2xl shadow-md object-cover border border-gray-100 w-full max-w-[320px] sm:max-w-[400px] h-auto"
                        />

                        {/* Overlay Text */}
                        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white px-3 py-[3px] rounded-md">
                            Image may not reflect the actual product
                        </p>
                    </div>

                    {/* Product Details */}
                    <div className="w-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-green-800 text-center md:text-left">
                                {product.name}
                            </h1>

                            <p className="text-base sm:text-lg text-gray-700 text-center md:text-left">
                                <span className="font-semibold text-gray-900">Category:</span>{" "}
                                {product.category_name}
                            </p>

                            {/* Product Extra Data */}
                            {product.extra_data &&
                                typeof product.extra_data === "object" &&
                                Object.keys(product.extra_data).length > 0 && (
                                    <div className="text-gray-700 text-sm sm:text-base mt-4 bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100">
                                        <div className="space-y-2">
                                            {Object.entries(product.extra_data).map(([key, value]) => (
                                                <div key={key} className="mb-2">
                                                    <span className="font-semibold capitalize text-green-900">
                                                        {key.replace(/_/g, " ")}:
                                                    </span>{" "}
                                                    {Array.isArray(value) ? (
                                                        <ul className="list-disc ml-5 text-gray-700">
                                                            {value.map((item, index) => (
                                                                <li key={index}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    ) : typeof value === "object" && value !== null ? (
                                                        <div className="ml-4 space-y-1 text-gray-700">
                                                            {Object.entries(value).map(([subKey, subValue]) => (
                                                                <div key={subKey}>
                                                                    <span className="font-semibold capitalize text-green-800">
                                                                        {subKey.replace(/_/g, " ")}:
                                                                    </span>{" "}
                                                                    {Array.isArray(subValue)
                                                                        ? subValue.join(", ")
                                                                        : typeof subValue === "object"
                                                                            ? JSON.stringify(subValue)
                                                                            : String(subValue)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-700">{String(value)}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            {/* Share Section */}
                            <div className="w-full">
                                <ProductShare product={product} />
                            </div>

                            {/* Contact Button */}
                            <div className="w-full flex justify-center">
                                <Link href="/contact" className="w-full md:w-auto">
                                    <button className="flex items-center justify-center gap-2 bg-green-700 text-white font-semibold px-10 py-3 rounded-lg shadow-lg hover:bg-green-800 hover:shadow-xl transition-all duration-300 w-[90%] md:w-[300px]">
                                        <FaEnvelope className="text-xl" />
                                        Contact Us
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

