import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CreateProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    product_category_id: "",
    image: null,
  });

  useEffect(() => {
    fetch("/api/admin/product-category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("product_category_id", form.product_category_id);

    if (form.image) {
      data.append("image", form.image);
    }

    const res = await fetch("/api/admin/product", {
      method: "POST",
      body: data,
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Failed to create product");
      return;
    }

    alert("Product created successfully!");
    router.push("/admin/products");
  };

  const inputClass =
    "w-full mt-1 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Create Product
        </h1>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Product Name
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Category
          </label>
          <select
            className={inputClass}
            value={form.product_category_id}
            onChange={(e) =>
              setForm({ ...form, product_category_id: e.target.value })
            }
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700 cursor-pointer"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium shadow-md transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
