"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";

/* ---------- Helper ---------- */
const parseExtra = (extra) => {
    if (!extra) return null;
    if (typeof extra === "object") return extra;
    if (typeof extra === "string") {
        try {
            return JSON.parse(extra);
        } catch {
            return extra.trim();
        }
    }
    return null;
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [extraCategories, setExtraCategories] = useState([]);
    const [selectedExtraCategory, setSelectedExtraCategory] = useState("All");
    const [showExtraFilter, setShowExtraFilter] = useState(false);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    /* ---------- Load Products ---------- */
    useEffect(() => {
        async function loadProducts() {
            setLoading(true);

            const res = await fetch("/api/products");
            const data = await res.json();

            setProducts(data);

            const uniqueCategories = [
                ...new Set(data.map((p) => p.category_name)),
            ];
            setCategories(uniqueCategories);

            setLoading(false);
        }
        loadProducts();
    }, []);

    /* ---------- Main Category Filter ---------- */
    useEffect(() => {
        if (category) {
            setSelectedCategory(category);
            setSelectedExtraCategory("All");

            const filtered = products.filter(
                (p) => p.category_name === category
            );
            setFilteredProducts(filtered);

            const hasExtra = filtered.some((p) => {
                const extra = parseExtra(p.extra_data);
                return typeof extra === "object" && extra?.category;
            });

            setShowExtraFilter(hasExtra);

            if (hasExtra) {
                const extraForCategory = filtered
                    .map((p) => {
                        const extra = parseExtra(p.extra_data);
                        if (typeof extra === "object" && extra?.category)
                            return String(extra.category).trim();
                        return null;
                    })
                    .filter(Boolean);

                setExtraCategories([...new Set(extraForCategory)]);
            } else {
                setExtraCategories([]);
            }
        } else {
            setSelectedCategory("All Products");
            setSelectedExtraCategory("All");
            setFilteredProducts(products);
            setShowExtraFilter(false);
            setExtraCategories([]);
        }
    }, [category, products]);

    /* ---------- Extra Category Filter ---------- */
    useEffect(() => {
        if (selectedExtraCategory !== "All") {
            setFilteredProducts(
                products.filter((p) => {
                    const extra = parseExtra(p.extra_data);
                    const extraValue =
                        typeof extra === "object" && extra?.category
                            ? String(extra.category)
                            : "";

                    return (
                        (!category || p.category_name === category) &&
                        extraValue === selectedExtraCategory
                    );
                })
            );
        } else {
            setFilteredProducts(
                category
                    ? products.filter((p) => p.category_name === category)
                    : products
            );
        }
    }, [selectedExtraCategory, products, category]);

    /* ---------- Loading ---------- */
    if (loading) return <LoadingScreen />;

    return (
        <div>
            <Header />

            <main className="p-4 sm:p-6 bg-white min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-900 text-center font-droid-serif">
                    {selectedCategory}
                </h1>

                {/* Extra Filter */}
                {showExtraFilter && extraCategories.length > 0 && (
                    <div className="flex justify-center mb-6">
                        <select
                            value={selectedExtraCategory}
                            onChange={(e) =>
                                setSelectedExtraCategory(e.target.value)
                            }
                            className="border border-green-500 rounded-lg px-3 py-2 text-sm sm:text-base text-black w-[80%] sm:w-auto"
                        >
                            <option value="All">All</option>
                            {extraCategories.map((extra, i) => (
                                <option key={i} value={extra}>
                                    {extra}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => {
                            const extra = parseExtra(p.extra_data);

                            const extraText =
                                typeof extra === "object" && extra?.category
                                    ? extra.category
                                    : "";

                            return (
                                <Link key={p.id} href={`/product/${p.slug}`}>
                                    <div className="flex flex-col justify-between border border-green-300 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer bg-green-50 hover:bg-green-100 p-2 sm:p-4 h-full min-h-[240px] sm:min-h-[300px]">

                                        <div className="flex flex-col items-center flex-grow">

                                            {/* Image Container */}
                                            <div className="w-full aspect-square overflow-hidden rounded-lg bg-white relative">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_AWS_URL}/hnco-infusions/products/${p.image}`}
                                                    alt={p.name}
                                                    width={300}
                                                    height={300}
                                                    className="object-cover w-full h-full"
                                                />

                                                {/* Overlay Text */}
                                                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] sm:text-[10px] text-white/90 px-2 py-[2px] rounded">
                                                    Image for representation only
                                                </p>
                                            </div>

                                            {/* Content */}
                                            <div className="mt-3 sm:mt-5 text-center flex flex-col justify-start flex-grow">

                                                <h2 className="text-[10px] sm:text-xs text-black font-semibold min-h-[28px] sm:min-h-[32px] flex items-center justify-center text-center px-1">
                                                    {p.name}
                                                </h2>

                                                <p className="text-[10px] sm:text-xs text-center text-black mt-1 min-h-[16px]">
                                                    {p.category_name || "Uncategorized"}
                                                </p>

                                                {extraText && (
                                                    <p className="text-[10px] sm:text-xs text-center text-gray-600 mt-1 min-h-[16px]">
                                                        {extraText}
                                                    </p>
                                                )}

                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p className="text-center text-black col-span-full">
                            No products found
                        </p>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

