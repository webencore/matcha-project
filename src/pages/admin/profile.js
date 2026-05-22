import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "./layout";

export default function Profile() {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/admin/me");

                if (!res.ok) {
                    router.replace("/admin/login");
                    return;
                }

                const data = await res.json();
                setAdmin(data);
            } catch (err) {
                router.replace("/admin/login");
            }
        }

        fetchProfile();
    }, [router]);

    if (!admin) return null;

    /* STYLES */
    const titleStyle = {
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "30px",
        color: "#111",
    };

    const cardWrapperStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 160px)", // accounts for header & padding
    };

    const cardStyle = {
        background: "#fff",
        borderRadius: "10px",
        padding: "25px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    };

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
        fontSize: "15px",
    };

    const labelStyle = {
        color: "#666",
        fontWeight: "500",
    };

    const valueStyle = {
        color: "#111",
        fontWeight: "600",
    };

    const headerStyle = {
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
    };

    const avatarStyle = {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: "600",
        marginRight: "15px",
    };

    return (
        <AdminLayout>
            <h1 style={titleStyle}>Admin Profile</h1>

            <div style={cardWrapperStyle}>
                <div style={cardStyle}>
                    {/* HEADER */}
                    <div style={headerStyle}>
                        <div style={avatarStyle}>
                            {admin.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                {admin.name}
                            </div>
                            <div style={{ fontSize: "14px", color: "#777" }}>
                                {admin.email}
                            </div>
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <span style={labelStyle}>Name</span>
                        <span style={valueStyle}>{admin.name}</span>
                    </div>

                    <div style={rowStyle}>
                        <span style={labelStyle}>Email</span>
                        <span style={valueStyle}>{admin.email}</span>
                    </div>

                    <div style={{ ...rowStyle, borderBottom: "none" }}>
                        <span style={labelStyle}>Role</span>
                        <span style={valueStyle}>{admin.role}</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
