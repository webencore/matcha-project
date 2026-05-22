import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { BsMicrosoftTeams } from "react-icons/bs";
import {
    FiHome,
    FiLogOut,
    FiUser,
    FiBox,
    FiMenu
} from "react-icons/fi";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const isActive = (path) => router.pathname === path;

    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    /* Detect screen size */
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth <= 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    /* SIDEBAR STYLES */
    const sidebarStyle = {
        width: "240px",
        background: "#111",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
        position: isMobile ? "fixed" : "relative",
        top: 0,
        left: isMobile ? (open ? 0 : "-260px") : 0,
        transition: "0.3s",
        zIndex: 1000
    };

    const navItemStyle = {
        textDecoration: "none",
    };

    const navInnerStyle = (active = false) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "8px",
        color: active ? "#fff" : "#ccc",
        background: active ? "#2563eb" : "transparent",
        cursor: "pointer",
        whiteSpace: "nowrap",
    });

    /* HEADER */
    const headerStyle = {
        height: "64px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #e5e7eb",
        flexShrink: 0
    };

    const profileIconStyle = {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "#2563eb",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

            {/* OVERLAY (MOBILE) */}
            {isMobile && open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 999
                    }}
                />
            )}

            {/* SIDEBAR */}
            <aside style={sidebarStyle}>
                <h2 style={{ marginBottom: "30px", fontSize: "20px" }}>
                    Admin Panel
                </h2>

                <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    <Link href="/admin/dashboard" style={navItemStyle} onClick={() => setOpen(false)}>
                        <div style={navInnerStyle(isActive("/admin/dashboard"))}>
                            <FiHome size={18} /> Dashboard
                        </div>
                    </Link>

                    <Link href="/admin/products" style={navItemStyle} onClick={() => setOpen(false)}>
                        <div style={navInnerStyle(isActive("/admin/products"))}>
                            <FiBox size={18} /> Products
                        </div>
                    </Link>

                     <Link href="/admin/teams" style={navItemStyle} onClick={() => setOpen(false)}>
                        <div style={navInnerStyle(isActive("/admin/teams"))}>
                            <BsMicrosoftTeams size={18} /> Team
                        </div>
                    </Link>

                    <Link href="/admin/login" style={{ ...navItemStyle, marginTop: "auto" }} onClick={() => setOpen(false)}>
                        <div style={{ ...navInnerStyle(false), color: "#ff6b6b" }}>
                            <FiLogOut size={18} /> Logout
                        </div>
                    </Link>
                </nav>
            </aside>

            {/* RIGHT SIDE */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    marginLeft: 0   // 🔥 No desktop gap
                }}
            >

                {/* HEADER */}
                <header style={headerStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* HAMBURGER (MOBILE) */}
                        {isMobile && (
                            <div className = "text-black" onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
                                <FiMenu size={22} />
                            </div>
                        )}

                        <h3 className="text-black">Admin</h3>
                    </div>

                    <Link href="/admin/profile">
                        <div style={profileIconStyle}>
                            <FiUser size={18} />
                        </div>
                    </Link>
                </header>

                {/* CONTENT */}
                <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
