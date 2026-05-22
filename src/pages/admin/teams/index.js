import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../layout";
import { FiX, FiEdit2, FiTrash2, FiLinkedin } from "react-icons/fi";
import Image from "next/image";

export default function ProductList() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 20;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const baseUrl =
                typeof window !== "undefined"
                    ? ""
                    : process.env.NEXT_PUBLIC_BASE_URL;

            const res = await fetch(`${baseUrl}/api/admin/team`);

            if (!res.ok) {
                throw new Error("Failed to fetch employees");
            }

            const data = await res.json();
            setEmployees(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
        fetchEmployees();
    };

    const filteredEmployees = employees.filter(e =>
        (e.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.designation || "").toLowerCase().includes(search.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    if (loading) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 text-black">

                {/* Title + Count */}
                <div>
                    <h1 className="text-2xl font-semibold">Employees</h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Search Box */}
                    <div className="relative">
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by name or category..."
                            className="w-64 rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setCurrentPage(1);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                            >
                                <FiX size={16} />
                            </button>
                        )}
                    </div>

                    {/* Add Product Button */}
                    <Link href="/admin/teams/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition">
                            + Add Employee
                        </button>
                    </Link>

                </div>
            </div>


            {/* 👇 TABLE SCROLL AREA */}
            <div className="border rounded overflow-y-auto text-black" style={{ maxHeight: "60vh" }}>
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            <th className="border p-2">Sr No.</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Designation</th>
                            <th className="border p-2">Hobby</th>
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Linkedin</th>
                            <th className="border p-2">Joining Date</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.map((e, i) => (
                            <tr key={e.id}>
                                <td className="border p-2">{startIndex + i + 1}</td>
                                <td className="border p-2">{e.name}</td>
                                <td className="border p-2">{e.designation}</td>
                                <td className="border p-2">{e.hobby}</td>
                                <td className="border p-2">
                                    {e.image && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_AWS_URL}/employee/${e.image}`}
                                            className="w-14 h-14 object-cover"
                                            alt={"e.image"}
                                            width={200}
                                            height={200}
                                        />
                                    )}
                                </td>
                                <td className="border p-2 text-center">
                                    {e.linkedin_profile ? (
                                        <a
                                            href={e.linkedin_profile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                                            title="View LinkedIn Profile"
                                        >
                                            <FiLinkedin size={18} />
                                        </a>
                                    ) : (
                                        <a
                                            href="https://www.linkedin.com/feed/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                                            title="View LinkedIn Profile"
                                        >
                                            <FiLinkedin size={18} />
                                        </a>
                                    )}
                                </td>
                                <td className="border p-2">{e.joining_date}</td>

                                <td className="border p-2">
                                    <div className="flex items-center gap-2">
                                        {/* Edit */}
                                        <Link href={`/admin/teams/${e.id}`}>
                                            <button
                                                title="Edit"
                                                className="p-1 rounded hover:bg-yellow-100 text-yellow-600"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                        </Link>

                                        {/* Delete */}
                                        <button
                                            onClick={() => deleteEmployee(e.id)}
                                            title="Delete"
                                            className="p-1 rounded hover:bg-red-100 text-red-600"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex gap-3 mt-4 text-black">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    Prev
                </button>
                <span>{currentPage} / {totalPages || 1}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    Next
                </button>
            </div>
        </AdminLayout>
    );
}
