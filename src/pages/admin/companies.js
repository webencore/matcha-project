import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import Image from "next/image";

const styles = {
    page: { color: "#000", fontFamily: "Arial, sans-serif", padding: 20 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    addBtn: { background: "#000", color: "#fff", padding: "10px 16px", border: "none", cursor: "pointer", borderRadius: 4 },
    card: { background: "#fff", padding: 20, border: "1px solid #000", borderRadius: 6, marginBottom: 20 },
    label: { fontWeight: 600, marginBottom: 6, display: "block" },
    input: { width: "100%", padding: 10, marginBottom: 6, border: "1px solid #000", borderRadius: 4 },
    error: { color: "red", fontSize: 12, marginBottom: 10 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { borderBottom: "2px solid #000", padding: 12, textAlign: "left" },
    td: { padding: 12, borderBottom: "1px solid #ddd" },
    logo: { width: 50, height: 50, objectFit: "contain", border: "1px solid #000" },
    actionBtn: { marginRight: 8, padding: "6px 10px", border: "1px solid #000", cursor: "pointer" },
};

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        company_name: "",
        company_slug: "",
        company_website: "",
        status: "Active",
    });

    /* ================= FETCH ================= */
    const fetchCompanies = async () => {
        const res = await fetch("/api/admin/companies");
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (logoFile) formData.append("company_logo", logoFile);

        const url = editId
            ? `/api/admin/companies/${editId}`
            : "/api/admin/companies";

        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, { method, body: formData });
        const data = await res.json();

        if (!res.ok) {
            if (data.errors) {
                setErrors(data.errors);
                return;
            }
            alert(data.message || "Something went wrong");
            return;
        }

        setShowForm(false);
        setEditId(null);
        setLogoFile(null);
        setForm({
            company_name: "",
            company_slug: "",
            company_website: "",
            status: "Active",
        });

        fetchCompanies();
    };

    /* ================= EDIT ================= */
    const handleEdit = (company) => {
        setEditId(company.id);
        setForm({
            company_name: company.company_name,
            company_slug: company.company_slug,
            company_website: company.company_website || "",
            status: company.status,
            company_logo: company.company_logo
        });
        setErrors({});
        setShowForm(true);
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this company?")) return;

        try {
            const res = await fetch(`/api/admin/companies/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Delete failed");
            }

            fetchCompanies();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AdminLayout>
            <div style={styles.page}>
                <div style={styles.header}>
                    <h1>Companies</h1>
                    <button
                        style={styles.addBtn}
                        onClick={() => {
                            setShowForm(true);
                            setEditId(null);
                            setForm({
                                company_name: "",
                                company_slug: "",
                                company_website: "",
                                status: "Active",
                            });
                        }}
                    >
                        + Add Company
                    </button>
                </div>

                {showForm && (
                    <div style={styles.card}>
                        <form onSubmit={handleSubmit}>
                            <label style={styles.label}>Company Name</label>
                            <input
                                style={styles.input}
                                value={form.company_name}
                                onChange={(e) => {
                                    setForm({ ...form, company_name: e.target.value });
                                    setErrors({ ...errors, company_name: "" });
                                }}
                            />
                            {errors.company_name && <div style={styles.error}>{errors.company_name}</div>}

                            <label style={styles.label}>Slug</label>
                            <input
                                style={styles.input}
                                value={form.company_slug}
                                onChange={(e) => {
                                    setForm({ ...form, company_slug: e.target.value });
                                    setErrors({ ...errors, company_slug: "" });
                                }}
                            />
                            {errors.company_slug && <div style={styles.error}>{errors.company_slug}</div>}

                            <label style={styles.label}>Website</label>
                            <input
                                style={styles.input}
                                value={form.company_website}
                                onChange={(e) => {
                                    setForm({ ...form, company_website: e.target.value });
                                    setErrors({ ...errors, company_website: "" });
                                }}
                            />
                            {errors.company_website && <div style={styles.error}>{errors.company_website}</div>}

                            <label style={styles.label}>Logo</label>
                            <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />

                            <label style={styles.label}>Status</label>
                            <select
                                style={styles.input}
                                value={form.status}
                                onChange={(e) => {
                                    setForm({ ...form, status: e.target.value });
                                    setErrors({ ...errors, status: "" });
                                }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {errors.status && <div style={styles.error}>{errors.status}</div>}

                            <button style={styles.addBtn} type="submit">
                                {editId ? "Update" : "Save"}
                            </button>
                        </form>
                    </div>
                )}

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Logo</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Website</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((c) => (
                            <tr key={c.id}>
                                <td style={styles.td}>
                                    {c.company_logo && (
                                        <Image
                                            src={c.company_logo}
                                            alt="Company Logo"
                                            width={60}
                                            height={60}
                                            style={styles.logo}
                                        />
                                    )}
                                </td>

                                <td style={styles.td}>{c.company_name}</td>
                                <td style={styles.td}>{c.company_website}</td>
                                <td style={styles.td}>{c.status}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={() => handleEdit(c)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
