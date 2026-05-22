"use client";
import Link from "next/link";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaWhatsapp,
    FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer
            className="relative rounded-t-lg overflow-hidden text-white font-serif mx-2 bg-cover bg-center"
            style={{
                backgroundImage: "url('/Images/footer-bg.jpeg')",
            }}
        >
            {/* Black transparent overlay */}
            <div className="absolute inset-0 bg-black/70 rounded-lg"></div>

            {/* Footer content */}
            <div className="relative z-10 p-6">
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full px-2 sm:px-6 py-10">
                    {/* About Section */}
                    <div className="max-w-md w-full text-center md:text-left">
                        <div className="mb-3 mx-auto md:mx-0 flex items-center justify-center md:justify-start gap-3">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#244332] text-xl font-bold tracking-wide text-[#f4d36b]">
                                DS
                            </span>
                            <div className="text-left">
                                <p className="text-2xl font-bold">DS Baverages</p>
                                <p className="text-xs tracking-[0.25em] text-[#f4d36b]">MATCHA & TRADITIONAL DRINKS</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed mt-4">
                            <strong>DS Baverages</strong> crafts matcha, Japanese-inspired drinks,
                            herbal infusions, coffee blends, and traditional beverage solutions
                            for brands, cafes, and modern wellness shelves.
                        </p>

                        {/* Social icons */}
                        <div className="flex justify-center md:justify-start gap-4 mt-5 text-lg">
                            <Link
                                href="https://www.facebook.com/share/1FftkXfmmZ/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaFacebookF className="hover:text-gray-200" />
                            </Link>
                            <Link
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram className="hover:text-gray-200" />
                            </Link>
                            <Link
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedinIn className="hover:text-gray-200" />
                            </Link>
                            <Link
                                href="https://wa.me/919773989293"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp className="hover:text-gray-200" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="w-full sm:w-auto text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm justify-items-center md:justify-items-start">
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                            <Link href="/about" className="hover:underline">
                                About Us
                            </Link>
                            <Link href="/products" className="hover:underline">
                                Products
                            </Link>
                            <Link href="/services" className="hover:underline">
                                Services
                            </Link>
                            <Link href="/certification" className="hover:underline">
                                Certification
                            </Link>
                            <Link href="/contact" className="hover:underline">
                                Contact Us
                            </Link>
                            <Link href="/team" className="hover:underline">
                                Our Team
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Back to Top Button */}
                <button
                    onClick={scrollToTop}
                    className="absolute right-4 sm:right-6 top-10 sm:top-16 bg-white text-[#244332] p-3 rounded-full shadow-lg hover:bg-gray-200 transition animate-bounce"
                    aria-label="Back to top"
                >
                    <FaArrowUp />
                </button>
            </div>

            {/* Footer Bottom */}
            <div className="bg-[#244332] text-center py-4 text-xs sm:text-sm rounded-t-lg relative z-10">
                © 2026 DS Baverages. All Rights Reserved.
            </div>
        </footer>
    );
}


