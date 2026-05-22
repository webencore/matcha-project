"use client";
import Image from 'next/image';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { RefreshCw, MapPin } from "lucide-react";

export default function Career() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    currentCtc: "",
    message: "",
    company: "", // honeypot
  });

  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  /* ================= LOAD CAPTCHA ================= */
  const loadCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha-secure");
      if (!res.ok) {
        throw new Error("Failed to load captcha, status: " + res.status);
      }
      const data = await res.json();
      setCaptchaSvg(data.svg);
      setCaptchaToken(data.captchaToken);
      setCaptcha("");
    } catch (error) {
      console.error("CAPTCHA load error:", error);
      setStatus("Failed to load CAPTCHA, please refresh the page.");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== "application/pdf") {
      alert("Only PDF resumes are allowed");
      e.target.value = "";
      return;
    }

    // File size validation (5MB)
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size should not exceed 5MB");
      e.target.value = "";
      return;
    }

    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setStatus("Please upload your PDF resume");
      return;
    }

    setStatus("Submitting application...");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    formData.append("resume", resume);
    formData.append("captcha", captcha);
    formData.append("captchaToken", captchaToken);

    try {
      const res = await fetch("/api/sendCareerMail", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Application submitted successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          position: "",
          currentCtc: "",
          message: "",
          company: "",
        });
        setResume(null);
        loadCaptcha();
      } else {
        setStatus("" + data.message);
        loadCaptcha();
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong");
      loadCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black">
      <Header />

      <main className="w-full mx-auto px-6 py-10 space-y-10">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          <Image
            src="/Images/Final_Career.jpeg"
            alt="Career Banner"
            fill
            sizes="100vw"
            className="object-contain lg:object-cover"
            priority
          />

          <div className="absolute inset-0 flex items-start pt-10 sm:pt-20">
            {/* ðŸ‘† force top positioning */}

            <div className="max-w-2xl w-full px-4 sm:px-12">

              <div className="inline-block rounded-xl p-4 sm:p-6 hero-text">

                <h1 className="text-black text-base sm:text-2xl lg:text-5xl font-bold leading-snug sm:leading-tight">
                  Build a Career.
                  <span className="block text-[#244332]">
                    Shape Better Beverages.
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <style jsx>
            {`
                .hero-text {
                    opacity: 0;
                    animation: slideInLeft 0.8s ease-out forwards;
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}
          </style>
        </div>

        {/* ===== Company Career Info ===== */}
        <section className="bg-white p-8 rounded-2xl shadow-md border space-y-10">

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Not a Job. A Build Zone.</h2>
            <p className="text-gray-700 leading-relaxed">
              We are not here to give you comfort. <br />
              We are here to give you <span className="font-semibold">responsibility, speed, and growth.</span>
            </p>
          </div>

          {/* Intro Points */}
          <div>
            <p className="mb-4 font-medium">DS Baverages is for people who want to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Move fast</li>
              <li>Take ownership</li>
              <li>Build something that actually matters</li>
            </ul>
            <p className="mt-4 text-gray-600">
              If you are looking for easy work or fixed routines, this is not your place.
            </p>
          </div>

          {/* Divider */}
          <hr />

          {/* Why Join */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Why People Join And Stay</h3>
            <div className="grid md:grid-cols-2 gap-6">

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Real Ownership</h4>
                <p className="text-gray-600 text-sm">You own outcomes from idea to launch.</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Fast Growth Curve</h4>
                <p className="text-gray-600 text-sm">6 months here = 2 years elsewhere.</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">No Micromanagement</h4>
                <p className="text-gray-600 text-sm">We expect ownership, not follow-ups.</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Direct Access</h4>
                <p className="text-gray-600 text-sm">No hierarchy. Just execution.</p>
              </div>

            </div>
          </div>

          {/* Work Culture + Not For + Who Thrives */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* What It Feels Like */}
            <div className="p-5 border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What It Feels Like</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>You will be pushed</li>
                <li>You will figure things out yourself</li>
                <li>You will make mistakes and fix them fast</li>
                <li>You will grow faster than you expect</li>
              </ul>
              <p className="mt-3 text-gray-600 text-sm">
                This is a build-fast, learn-fast system.
              </p>
            </div>

            {/* Not For */}
            <div className="p-5 border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-red-600">Who This Is NOT For</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>You need constant instructions</li>
                <li>You avoid accountability</li>
                <li>You prefer comfort over growth</li>
                <li>You wait to be told what to do</li>
                <li>You cannot handle feedback</li>
              </ul>
            </div>

            {/* Who Thrives */}
            <div className="p-5 border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-green-600">Who Thrives Here</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>Curious and proactive</li>
                <li>Comfortable taking ownership</li>
                <li>Solution-focused mindset</li>
                <li>Fast learner (and unlearner)</li>
                <li>Finishes what they start</li>
              </ul>
            </div>

          </div>

          <hr />

          {/* Timeline */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Your First 30-60-90 Days</h3>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">30 Days</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Understand operations</li>
                  <li>Take small responsibilities</li>
                  <li>Start contributing</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">60 Days</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Work independently</li>
                  <li>Improve systems</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">90 Days</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Own outcomes</li>
                  <li>Deliver measurable impact</li>
                </ul>
              </div>

            </div>
          </div>

          <hr />

          {/* Final CTA */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-xl font-semibold mb-2">Final Note</h3>
            <p className="text-gray-700 mb-4">
              If you want comfort, this is not for you.
              If you want growth, ownership, and impact, this is your place.
            </p>

            <p className="font-medium">
              Send your resume along with 3 lines on:
            </p>

            <p className="italic text-gray-800 mt-2">
              "Why should we choose you over someone else?"
            </p>
          </div>

        </section>


        {/* ===== Form Section ===== */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Careers at DS Baverages
          </h1>
          <p className="mt-3 text-lg text-gray-700 flex items-center gap-2">
            <MapPin size={18} />
            Noida, Uttar Pradesh, India
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white p-8 rounded-2xl shadow-xl space-y-4 border"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            style={{ display: "none" }}
          />

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="phone"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="position"
            placeholder="Position You Want to Apply"
            value={form.position}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="currentCtc"
            placeholder="Current CTC (e.g. 5 LPA / 6,00,000 per annum). You can also enter 0 if you're a fresher"
            value={form.currentCtc}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <textarea
            name="message"
            placeholder="Cover Letter / Message (optional)"
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 border rounded h-32"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />

          <div className="flex items-center gap-3">
            <div
              className="border rounded p-2 bg-white"
              dangerouslySetInnerHTML={{ __html: captchaSvg }}
            />
            <button type="button" onClick={loadCaptcha}>
              <RefreshCw size={18} />
            </button>
          </div>

          <input
            placeholder="Enter CAPTCHA"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />

          <button className="bg-[#244332] hover:bg-[#b8872b] text-white px-6 py-3 rounded">
            Apply Now
          </button>

          {status && <p className="mt-3">{status}</p>}
        </form>
      </main>

      <Footer />
    </div>
  );
}


