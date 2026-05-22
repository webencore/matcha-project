import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateEmployee() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    designation: "",
    hobby: "",
    image: null,
    linkedin_profile: "",
    joining_date: "",
    sr_number: "",
    about: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("designation", form.designation);
    data.append("hobby", form.hobby);
    if (form.image) {
      data.append("image", form.image);
    }

    data.append("linkedin_profile", form.linkedin_profile);
    data.append("joining_date", form.joining_date);
    data.append("sr_number", form.sr_number);
    data.append("about", form.about);

    const res = await fetch("/api/admin/team", {
      method: "POST",
      body: data,
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Failed to create employee");
      return;
    }

    alert("Employee created successfully!");
    router.push("/admin/teams");
  };

  const inputClass =
    "w-full mt-1 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <form onSubmit={submit} encType="multipart/form-data" className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Create Employee
        </h1>

        {/* Employee Name */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee Name
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter employee name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Employee Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee Designation
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter employee designation"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            required
          />
        </div>

        {/* Employee Hobby */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee Hobby
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter employee hobby"
            value={form.hobby}
            onChange={(e) => setForm({ ...form, hobby: e.target.value })}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee Image
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

        {/* Employee linkedin_profile */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee LinkedIn
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter employee linkedin profile"
            value={form.linkedin_profile}
            onChange={(e) => setForm({ ...form, linkedin_profile: e.target.value })}
            required
          />
        </div>

        {/* Employee Joining Date */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee Joining Date
          </label>
          <input
            type="date"
            className={inputClass}
            placeholder="Enter employee name"
            value={form.joining_date}
            onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
            required
          />
        </div>

        {/* Employee Sr Number */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Employee Sr Number
          </label>
          <input
            type="number"
            className={inputClass}
            placeholder="Enter employee serial number"
            value={form.sr_number}
            onChange={(e) => setForm({ ...form, sr_number: e.target.value })}
            required
          />
        </div>

        {/* About Employee */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            About Employee
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="About Employee"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium shadow-md transition"> Create Employee </button>
      </form>
    </div>
  );
}
