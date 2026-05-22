"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import LoadingScreen from "./components/LoadingScreen";

export default function Products() {
    const [expanded, setExpanded] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            setLoading(true); // Start loading

            const res = await fetch("/api/EmployeeCard");
            const data = await res.json();

            setProducts(data);
            setFilteredProducts(data);

            const uniqueCategories = [...new Set(data.map((p) => p.category_name))];
            setCategories(uniqueCategories);

            setLoading(false); // Finish loading
        }
        loadProducts();
    }, []);

    // Show loading screen while fetching data
    if (loading) return <LoadingScreen />;

    return (
        <div>
            <Header />

            <main className="p-6 bg-white">
                <h1 className="text-2xl font-bold mb-4 text-green-900 text-center">
                    Our Team
                </h1>

                <div className="overflow-x-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                            filteredProducts.map((e) => (
                                <div
                                    key={e.id}
                                    className="rounded-xl p-4 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center font-serif cursor-pointer"
                                    onClick={() => setSelectedEmployee(e)}
                                >
                                    <div className="w-30 h-30 rounded-full overflow-hidden mb-3">
                                        <Image
                                            // src={
                                            //     e.image
                                            //         ? `${process.env.NEXT_PUBLIC_AWS_URL}/employee/${e.image}`
                                            //         : "/default-avatar.png"
                                            // }
                                            src={
                                                e.image
                                                    ? `/team/${e.image}`
                                                    : "/default-avatar.png"
                                            }
                                            alt={e.name || "Employee"}
                                            width={120}
                                            height={120}
                                            className="rounded-full object-cover object-top"
                                        />
                                    </div>

                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                        {e.designation || "No Designation"}
                                    </h2>

                                    <h3 className="text-md text-gray-700 mb-2">
                                        {e.name || "Unnamed Employee"}
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 text-lg">
                                No employees found
                            </p>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50">
                    <div className="relative bg-white shadow-2xl rounded-2xl p-8 max-w-3xl w-full mx-4 border border-green-900 flex flex-col md:flex-row items-center md:items-start gap-8">

                        <button
                            onClick={() => setSelectedEmployee(null)}
                            className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-3xl font-bold transition"
                        >
                            &times;
                        </button>

                        <div className="flex-shrink-0">
                            <div className="w-44 h-44 md:w-48 md:h-48 rounded-full border-4 border-gray-300 overflow-hidden shadow-md">
                                <Image
                                    // src={
                                    //     selectedEmployee.image
                                    //         ? `/Images/employee/${selectedEmployee.image}`
                                    //         : "/default-avatar.png"
                                    // }
                                    src={
                                        selectedEmployee.image
                                            ? `/team/${selectedEmployee.image}`
                                            : "/default-avatar.png"
                                    }
                                    alt={selectedEmployee.name || "Employee"}
                                    width={192}
                                    height={192}
                                    className="object-cover object-top rounded-full"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center text-gray-800 space-y-3 w-full md:ml-4">
                            <h2 className="text-2xl font-bold text-[#0A2E57]">
                                {selectedEmployee.name}{" "}
                                <span className="text-gray-600 text-lg font-medium">
                                    ({selectedEmployee.designation || "N/A"})
                                </span>
                            </h2>

                            <p className="text-md text-gray-700">
                                <span className="font-semibold">Hobby:</span>{" "}
                                {selectedEmployee.hobby || "N/A"}
                            </p>

                            <div className="text-md text-gray-700 leading-relaxed">
                                <p className={`${expanded ? "" : "line-clamp-2"} transition-all duration-300`}>
                                    {selectedEmployee.about || "N/A"}
                                </p>

                                {selectedEmployee.about && selectedEmployee.about.length > 100 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-green-700 font-semibold mt-1 hover:underline"
                                    >
                                        {expanded ? "Show Less" : "Read More"}
                                    </button>
                                )}
                            </div>

                            {selectedEmployee.linkedin_profile && (
                                <a
                                    href={selectedEmployee.linkedin_profile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-800 transition"
                                >
                                    <span className="bg-blue-600 rounded-full p-2 shadow">
                                        <FaLinkedinIn className="text-white w-4 h-4" />
                                    </span>
                                    <span className="text-sm font-medium">View LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

