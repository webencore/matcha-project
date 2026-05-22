import { useEffect, useState } from "react";
import AdminLayout from "./layout";

const styles = {
    page: { color: "#000" },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    addBtn: {
        background: "#000",
        color: "#fff",
        padding: "10px 16px",
        border: "none",
        cursor: "pointer",
        borderRadius: 4,
    },

    card: {
        background: "#fff",
        padding: 20,
        border: "1px solid #000",
        borderRadius: 6,
        marginBottom: 20,
    },

    label: {
        fontWeight: 600,
        marginBottom: 6,
        display: "block",
        color: "#000",
    },

    input: {
        width: "100%",
        padding: 10,
        marginBottom: 14,
        border: "1px solid #000",
        color: "#000",
        background: "#fff",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        color: "#000",
    },

    th: {
        borderBottom: "2px solid #000",
        padding: 12,
        textAlign: "left",
    },

    td: {
        padding: 12,
        borderBottom: "1px solid #ddd",
        color: "#000",
    },

    actionBtn: {
        marginRight: 8,
        padding: "6px 10px",
        border: "1px solid #000",
        background: "#fff",
        cursor: "pointer",
        color: "#000",
    },
};

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        company_id: "",
        department_name: "",
        status: "Active",
    });

    const fetchData = async () => {
        const d = await fetch("/api/admin/departments").then((r) => r.json());
        const c = await fetch("/api/admin/companies").then((r) => r.json());

        setDepartments(Array.isArray(d) ? d : []);
        setCompanies(Array.isArray(c) ? c : []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddForm = () => {
        setForm({
            company_id: "",
            department_name: "",
            status: "Active",
        });
        setEditId(null);
        setShowForm(true);
    };

    const openEditForm = (d) => {
        setForm({
            company_id: d.company_id,
            department_name: d.department_name,
            status: d.status,
        });
        setEditId(d.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editId
            ? `/api/admin/departments/${editId}`
            : "/api/admin/departments";

        await fetch(url, {
            method: editId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setShowForm(false);
        fetchData();
    };

    const deleteDepartment = async (id) => {
        if (!confirm("Delete this department?")) return;
        await fetch(`/api/admin/departments/${id}`, { method: "DELETE" });
        fetchData();
    };

    return (
        <AdminLayout>
            <div style={styles.page}>
                <div style={styles.header}>
                    <h1>Departments</h1>
                    <button style={styles.addBtn} onClick={openAddForm}>
                        + Add Department
                    </button>
                </div>

                {showForm && (
                    <div style={styles.card}>
                        <form onSubmit={handleSubmit}>
                            <label style={styles.label}>Select Company</label>
                            <select
                                style={styles.input}
                                value={form.company_id}
                                onChange={(e) =>
                                    setForm({ ...form, company_id: e.target.value })
                                }
                                required
                            >
                                <option value="">Select Company</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.company_name}
                                    </option>
                                ))}
                            </select>

                            <label style={styles.label}>Department Name</label>
                            <input
                                style={styles.input}
                                value={form.department_name}
                                onChange={(e) =>
                                    setForm({ ...form, department_name: e.target.value })
                                }
                                required
                            />

                            <label style={styles.label}>Status</label>
                            <select
                                style={styles.input}
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>

                            <button style={styles.addBtn}>
                                {editId ? "Update" : "Save"}
                            </button>
                            <button
                                style={{
                                    ...styles.addBtn,
                                    background: "#fff",
                                    color: "#000",
                                    border: "1px solid #000",
                                    marginLeft: 10,
                                }}
                                type="button"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Company</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((d) => (
                            <tr key={d.id}>
                                <td style={styles.td}>{d.department_name}</td>
                                <td style={styles.td}>{d.company_name}</td>
                                <td style={styles.td}>{d.status}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={() => openEditForm(d)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={() => deleteDepartment(d.id)}
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
