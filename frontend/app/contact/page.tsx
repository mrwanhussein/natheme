"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [userName, setUserName] = useState(""); // ✅ store user's name

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    const token = localStorage.getItem("token");
    if (!token) {
      setShowSignIn(true);
      return;
    }

    setStatus("sending...");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setUserName(formData.name); // ✅ save the name before clearing
        setShowThankYou(true);
        setFormData({ name: "", email: "", message: "" });
        setStatus("");
      } else {
        setStatus(data.error || "❌ Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("❌ Server error.");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signInData),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setShowSignIn(false);
        setStatus("✅ Signed in! You can now send a message.");
      } else {
        setStatus(data.message || "❌ Invalid credentials.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setStatus("❌ Could not sign in. Try again.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#01363A] to-[#001F21] text-white min-h-screen flex flex-col justify-between">
      {/* Header */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/contact-hero2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold text-[#E7FFCF]"
          >
            Contact Us
          </motion.h1>
          <p className="text-lg mt-4 text-gray-200 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question or want to
            collaborate, feel free to reach out.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-2 gap-10 items-start">
        {/* Left - Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-[#E7FFCF]">
            Get in Touch
          </h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Have a project in mind or just want to say hello? Drop us a message
            and we’ll get back to you soon.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <h4 className="font-semibold text-[#E7FFCF]">Email</h4>
              <p className="text-gray-300">yourcompany@example.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#E7FFCF]">Phone</h4>
              <p className="text-gray-300">+20 123 456 7890</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-[#E7FFCF] mb-4">
            Send us a Message
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-[#E7FFCF] text-[#01363A] font-semibold py-3 rounded-lg hover:bg-[#c5f7a3] transition-all"
          >
            Send Message
          </button>

          {status && (
            <p className="text-sm text-gray-200 mt-2 text-center">{status}</p>
          )}
        </motion.form>
      </section>

      {/* Sign In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-8 w-96 text-center text-white"
            >
              <h2 className="text-2xl font-semibold text-[#E7FFCF] mb-4">
                Sign In to Continue
              </h2>
              <form onSubmit={handleSignIn} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#E7FFCF] text-[#01363A] font-semibold py-3 rounded-lg hover:bg-[#c5f7a3] transition-all"
                >
                  Sign In
                </button>
              </form>
              <p className="text-sm text-gray-300 mt-4">
                Don’t have an account?{" "}
                <a
                  href="/signup"
                  className="text-[#E7FFCF] underline hover:text-[#c5f7a3]"
                >
                  Sign Up
                </a>
              </p>
              <button
                onClick={() => setShowSignIn(false)}
                className="mt-4 text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Thank You Modal (with user name) */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-8 w-96 text-center text-white"
            >
              <h2 className="text-3xl font-bold text-[#E7FFCF] mb-3">
                Thank You, {userName || "Friend"}! 🌿
              </h2>
              <p className="text-gray-300 mb-6">
                We’ve received your message and will get in touch with you soon.
              </p>
              <button
                onClick={() => setShowThankYou(false)}
                className="bg-[#E7FFCF] text-[#01363A] font-semibold px-6 py-2 rounded-lg hover:bg-[#c5f7a3] transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
