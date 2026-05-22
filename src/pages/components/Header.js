"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaChevronDown, FaArrowRight } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const [categories, setCategories] = useState([]);

    const [productsOpen, setProductsOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const productsRef = useRef(null);
    const aboutRef = useRef(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (Array.isArray(data)) {
                    const unique = [...new Set(data.map(p => p.category_name))];
                    setCategories(unique);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (productsRef.current && !productsRef.current.contains(e.target)) {
                setProductsOpen(false);
            }
            if (aboutRef.current && !aboutRef.current.contains(e.target)) {
                setAboutOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategoryClick = (category) => {
        router.push(`/products?category=${encodeURIComponent(category)}`);
        setMenuOpen(false);
        setMobileProductsOpen(false);
        setMobileAboutOpen(false);
    };

    const handleLinkClick = (href) => {
        router.push(href);
        setMenuOpen(false);
        setMobileProductsOpen(false);
        setMobileAboutOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center px-6 py-4">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#244332] text-sm font-bold tracking-wide text-[#f4d36b]">
                        DS
                    </span>
                    <span className="hidden sm:flex flex-col leading-tight">
                        <span className="text-lg font-bold text-[#244332]">DS Baverages</span>
                        <span className="text-xs tracking-[0.2em] text-[#b8872b]">MATCHA & TRADITIONAL DRINKS</span>
                    </span>
                </Link>

                {/* DESKTOP SECTION */}
                <div className="hidden md:flex flex-1 items-center">

                    {/* CENTER NAV */}
                    <nav className="flex-1 flex justify-center gap-8 text-lg font-medium">

                        <Link href="/" className={pathname === "/" ? "text-[#244332] font-bold" : "text-black"}>
                            Home
                        </Link>

                        {/* ABOUT */}
                        <div ref={aboutRef} className="relative text-black">
                            <button
                                onClick={() => {
                                    setAboutOpen(!aboutOpen);
                                    setProductsOpen(false);
                                }}
                                className="flex items-center gap-1 text-black hover:text-[#244332]"
                            >
                                About Us <FaChevronDown size={12} />
                            </button>

                            {aboutOpen && (
                                <div className="absolute mt-2 w-48 bg-white border rounded shadow">
                                    <button onClick={() => handleLinkClick("/about")} className="block w-full text-left px-4 py-2 hover:bg-[#edf6ec]">
                                        About
                                    </button>
                                    <button onClick={() => handleLinkClick("/team")} className="block w-full text-left px-4 py-2 hover:bg-[#edf6ec]">
                                        Our Team
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* PRODUCTS */}
                        <div ref={productsRef} className="relative">
                            <button
                                onClick={() => {
                                    setProductsOpen(!productsOpen);
                                    setAboutOpen(false);
                                }}
                                className="flex items-center gap-1 text-black hover:text-[#244332]"
                            >
                                Products <FaChevronDown size={12} />
                            </button>

                            {productsOpen && (
                                <div className="absolute mt-2 w-56 bg-white border rounded shadow">
                                    {categories.map((cat, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleCategoryClick(cat)}
                                            className="block text-black w-full text-left px-4 py-2 hover:bg-[#edf6ec]"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/certification" className="text-black">Certification</Link>
                        <Link href="/career" className="text-black">Career</Link>
                        <Link href="/services" className="text-black">Services</Link>
                        <Link href="/contact" className="text-black">Contact Us</Link>
                    </nav>

                    {/* RIGHT SIDE SHOP BUTTON */}
                    <div className="ml-auto">
                        <a
                            href="/contact"
                            className="relative group inline-block"
                        >
                            {/* Animated Border */}
                            <span className="absolute inset-0 rounded-lg border-2 border-[#d6a43a] animate-pulse"></span>

                            {/* Button */}
                            <span className="relative flex items-center gap-2 bg-[#244332] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#b8872b] transition-all duration-300">

                                {/* Animated content */}
                                <span className="flex items-center gap-2 animate-pulse">
                                    Enquire
                                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
                                </span>

                            </span>
                        </a>
                    </div>
                </div>

                {/* MOBILE TOGGLE */}
                <button
                    className="md:hidden ml-auto text-2xl text-black"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="flex flex-col px-6 py-4 gap-4 text-lg font-semibold text-black">

                        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>

                        <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)} className="flex justify-between">
                            About Us <FaChevronDown />
                        </button>

                        {mobileAboutOpen && (
                            <>
                                <Link href="/about" onClick={() => setMenuOpen(false)} className="pl-4">About</Link>
                                <Link href="/team" onClick={() => setMenuOpen(false)} className="pl-4">Our Team</Link>
                            </>
                        )}

                        <button onClick={() => setMobileProductsOpen(!mobileProductsOpen)} className="flex justify-between">
                            Products <FaChevronDown />
                        </button>

                        {mobileProductsOpen &&
                            categories.map((cat, i) => (
                                <button key={i} onClick={() => handleCategoryClick(cat)} className="pl-4 text-left">
                                    {cat}
                                </button>
                            ))}

                        <Link href="/certification" onClick={() => setMenuOpen(false)}>Certification</Link>
                        <Link href="/career" onClick={() => setMenuOpen(false)}>Career</Link>
                        <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
                        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>

                        {/* MOBILE SHOP BUTTON */}
                        <div className="mt-auto">
                            <a
                                href="/contact"
                                className="block w-full mt-4"
                            >
                                <div className="flex items-center justify-center bg-[#244332] text-white font-semibold py-3 rounded-xl shadow-md active:scale-95 transition-all duration-200">

                                    {/* Animated Content */}
                                    <span className="flex items-center gap-2 animate-pulse">
                                        Enquire Now
                                        <FaArrowRight className="text-sm" />
                                    </span>

                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            )}
        </header>
    );
}

