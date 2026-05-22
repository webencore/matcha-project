"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Phone, Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // honeypot
  });

  const [status, setStatus] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaId, setCaptchaId] = useState("");

  /* ================= LOAD CAPTCHA ================= */
  const loadCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha");
      const data = await res.json();
      setCaptchaSvg(data.svg);
      setCaptchaId(data.captchaId);
      setCaptcha("");
    } catch (err) {
      console.error("Captcha load failed");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          captcha,
          captchaId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "", company: "" });
        loadCaptcha();
      } else {
        setStatus("" + data.message);
        loadCaptcha();
      }
    } catch (err) {
      setStatus("Something went wrong");
      loadCaptcha();
    }
  };

  // =====================================================================================
  const locations = [
    {
      id: 1,
      name: "DS Baverages",
      position: [28.732095978979853, 77.38437395592014],
      address:
        "198, C Block Road, B Block, Sector 63, Noida, Hazratpur Wajidpur, Uttar Pradesh 201309",
      icon: "DS",
      Phone: ["+91 97739 89293"],
      timing: "Mon- Sat : 10:00 am - 08:30 pm",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start p-8 w-full">
        <div className="w-full max-w-[1200px] flex flex-col gap-8 font-serif items-stretch">

          <div className="w-full flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 p-4 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 h-[350px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Noida%20Uttar%20Pradesh%20India&output=embed"
                className="w-full h-full rounded-xl"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="w-full lg:w-1/2 p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 mx-auto h-[350px] overflow-auto">
              <h2 className="text-3xl font-bold text-black mb-3">Visit Us</h2>
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="w-full p-7 rounded-lg border-l-6 border-[#b8872b] bg-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl"
                >
                  <h1 className="text-xl font-semibold text-black">
                    {loc.icon} {loc.name}
                  </h1>
                  <p className="text-black mt-3 leading-relaxed">{loc.address}</p>

                  {loc.Phone && (
                    <p className="text-base text-black mt-3 flex items-center">
                      <Phone size={18} className="mr-2" />
                      {loc.Phone.join(", ")}
                    </p>
                  )}
                  {loc.timing && (
                    <p className="text-base text-black mt-2 flex items-center">
                      <Clock size={18} className="mr-2" />
                      {loc.timing}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form (Now below map + addresses) */}
          <div className="w-full mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-black">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">

              <label className="text-black font-semibold">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="p-3 border text-black rounded border-[#244332]"
              />

              <label className="text-black font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="p-3 border text-black rounded border-[#244332]"
              />

              <label className="text-black font-semibold">Message</label>
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="p-3 border text-black rounded border-[#244332] h-32"
              />

              {/* CAPTCHA */}
              <div className="flex items-center gap-3">
                <div
                  className="border rounded p-2 bg-white"
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                />
                <button
                  type="button"
                  onClick={loadCaptcha}
                  className="p-2 border rounded-full"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <input
                placeholder="Enter CAPTCHA"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
                className="p-3 border rounded"
              />

              <button
                type="submit"
                className="bg-[#244332] text-white py-2 rounded hover:bg-[#b8872b]"
              >
                Send Message
              </button>
            </form>
            {status && <p className="mt-4 text-black">{status}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


