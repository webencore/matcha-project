import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    hobby: "",
    image: null,
    oldImage: "",
    linkedin_profile: "",
    joining_date: "",
    about: "",
    sr_number: "",
  });

  /* ================= LOAD EMPLOYEE ================= */
  useEffect(() => {
    if (!router.isReady || !id) return;

    const loadEmployee = async () => {
      try {
        const res = await fetch(`/api/admin/team/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Failed to load employee");
          return;
        }

        setForm({
          name: data.name || "",
          designation: data.designation || "",
          hobby: data.hobby || "",
          image: null,
          oldImage: data.image || "",
          linkedin_profile: data.linkedin_profile || "",
          joining_date: data.joining_date
            ? data.joining_date.split("T")[0]
            : "",
          about: data.about || "",
          sr_number: data.sr_number || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Load error:", error);
        alert("Error loading employee");
      }
    };

    loadEmployee();
  }, [router.isReady, id]);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("designation", form.designation);
      formData.append("hobby", form.hobby);
      formData.append("linkedin_profile", form.linkedin_profile);
      formData.append("joining_date", form.joining_date);
      formData.append("about", form.about);
      formData.append("sr_number", form.sr_number);

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Update failed");
        return;
      }

      alert("Employee updated successfully!");
      router.push("/admin/teams");
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    }
  };

  /* ================= INPUT STYLE ================= */
  const inputClass =
    "w-full mt-1 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-black text-xl font-semibold text-center">Edit Employee</h1>

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Employee Name</label>
          <input
            type="text"
            className={inputClass}
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
        </div>

        {/* DESIGNATION */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Designation</label>
          <input
            type="text"
            className={inputClass}
            value={form.designation}
            onChange={(e) =>
              setForm({ ...form, designation: e.target.value })
            }
            required
          />
        </div>

        {/* HOBBY */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Hobby</label>
          <input
            type="text"
            className={inputClass}
            value={form.hobby}
            onChange={(e) =>
              setForm({ ...form, hobby: e.target.value })
            }
            required
          />
        </div>

        {/* OLD IMAGE */}
        {form.oldImage && (
          <div>
            <label className="block text-sm font-medium text-gray-800">Current Image</label>
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_URL}/employee/${form.oldImage}`}
              width={120}
              height={120}
              className="rounded object-cover border"
              alt="Employee"
            />
          </div>
        )}

        {/* NEW IMAGE */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Change Image</label>
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

        {/* LINKEDIN */}
        <div>
          <label className="block text-sm font-medium text-gray-800">LinkedIn</label>
          <input
            type="url"
            className={inputClass}
            value={form.linkedin_profile}
            onChange={(e) =>
              setForm({
                ...form,
                linkedin_profile: e.target.value,
              })
            }
            required
          />
        </div>

        {/* JOINING DATE */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Joining Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.joining_date}
            onChange={(e) =>
              setForm({
                ...form,
                joining_date: e.target.value,
              })
            }
            required
          />
        </div>

        {/* ABOUT */}
        <div>
          <label className="block text-sm font-medium text-gray-800">About</label>
          <textarea
            className={inputClass}
            value={form.about}
            onChange={(e) =>
              setForm({ ...form, about: e.target.value })
            }
            required
          />
        </div>

        {/* SR NUMBER */}
        <div>
          <label className="block text-sm font-medium text-gray-800">Sr Number</label>
          <input
            type="number"
            className={inputClass}
            value={form.sr_number}
            onChange={(e) =>
              setForm({ ...form, sr_number: e.target.value })
            }
            required
          />
        </div>

        {/* SUBMIT */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Update Employee
        </button>
      </form>
    </div>
  );
}