import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function EditProduct() {
  const router = useRouter();
  const { slug } = router.query;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    product_category_id: "",
    image: null,
    oldImage: null
  });

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const p = await fetch(`/api/admin/product/${slug}`).then(r => r.json());
      const c = await fetch("/api/admin/product-category").then(r => r.json());

      setCategories(c);
      setForm({
        name: p.name,
        product_category_id: p.product_category_id,
        image: null,
        oldImage: p.image
      });

      setLoading(false);
    };

    load();
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("product_category_id", form.product_category_id);
    if (form.image) fd.append("image", form.image);

    const res = await fetch(`/api/admin/product/${slug}`, {
      method: "PUT",
      body: fd
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Update failed");
      return;
    }

    alert("Updated successfully!");
    router.push("/admin/products");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 p-6">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

        <h1 className="text-xl font-semibold text-center">Edit Product</h1>

        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <select
          value={form.product_category_id}
          onChange={(e) => setForm({ ...form, product_category_id: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {form.oldImage && (
          <Image
            // src={`${process.env.NEXT_PUBLIC_AWS_URL}/products/${form.oldImage}`}
            src={`${process.env.NEXT_PUBLIC_AWS_URL}/hnco-infusions/products/${form.oldImage}`}

            width={120}
            height={120}
            className="rounded object-cover"
          />
        )}

        <input
          type="file"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Product
        </button>

      </form>
    </div>
  );
}
