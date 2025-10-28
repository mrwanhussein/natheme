"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#01363A] text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 relative">
        {/* Animated Background Light */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#A4E96C]/10 to-transparent blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/logo.png" // Place your logo file as 'public/logo.png'
            alt="Natheme Logo"
            width={120}
            height={120}
            className="mb-6"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-4 text-[#A4E96C]"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Natheme
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-[#E7FFCF] max-w-2xl mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Bringing nature to your walls 🌿 — Natheme creates sustainable
          vertical gardens that turn any wall into a living piece of art.
        </motion.p>

        <motion.a
          href="#explore"
          className="bg-[#A4E96C] text-[#01363A] px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#E7FFCF] transition"
          whileHover={{ scale: 1.05 }}
        >
          Explore Designs
        </motion.a>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="explore"
        className="py-24 px-6 md:px-20 bg-[#E7FFCF] text-[#01363A] text-center"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Why Vertical Gardens?
        </motion.h2>

        <motion.p
          className="max-w-3xl mx-auto mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          With Natheme, every wall becomes a green canvas — improving air
          quality, enhancing mood, and creating harmony between architecture and
          nature. Our mission is to reconnect modern living with natural beauty.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <Image
              src="/plants-wall-1.jpg"
              alt="Vertical Garden 1"
              width={400}
              height={300}
              className="rounded-xl mb-4 object-cover w-full h-60"
            />
            <h3 className="text-xl font-semibold text-[#01363A]">
              Sustainable Design
            </h3>
            <p className="text-gray-600 mt-2">
              Eco-friendly systems that minimize water and energy consumption.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <Image
              src="/plants-wall-2.jpg"
              alt="Vertical Garden 2"
              width={400}
              height={300}
              className="rounded-xl mb-4 object-cover w-full h-60"
            />
            <h3 className="text-xl font-semibold text-[#01363A]">
              Smart Integration
            </h3>
            <p className="text-gray-600 mt-2">
              Automated irrigation and sensor systems for easy maintenance.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-md"
          >
            <Image
              src="/plants-wall-3.jpg"
              alt="Vertical Garden 3"
              width={400}
              height={300}
              className="rounded-xl mb-4 object-cover w-full h-60"
            />
            <h3 className="text-xl font-semibold text-[#01363A]">
              Aesthetic Harmony
            </h3>
            <p className="text-gray-600 mt-2">
              Modern green walls that complement interior and exterior designs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#01363A] text-center py-8 text-[#E7FFCF]">
        <p className="text-sm">
          © {new Date().getFullYear()} Natheme — Growing life in every wall 🌿
        </p>
      </footer>
    </main>
  );
}
