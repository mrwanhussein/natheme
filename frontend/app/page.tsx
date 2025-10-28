"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-green-700 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-green-500">Natheme</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Bringing nature to your walls 🌿 — Natheme helps you design beautiful,
          sustainable vertical gardens that transform your space into a living
          ecosystem.
        </motion.p>

        <motion.a
          href="#about"
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Discover More
        </motion.a>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 md:px-20 text-center">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">
          Why Vertical Gardens?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          Vertical gardening is the future of sustainable living. Whether for
          homes, offices, or public spaces, Natheme makes it simple to integrate
          plants into your environment — improving air quality, reducing stress,
          and adding life to every wall.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Image
            src="/wall-garden-1.jpg"
            alt="Wall Garden Example 1"
            width={300}
            height={200}
            className="rounded-2xl shadow-lg object-cover"
          />
          <Image
            src="/wall-garden-2.jpg"
            alt="Wall Garden Example 2"
            width={300}
            height={200}
            className="rounded-2xl shadow-lg object-cover"
          />
          <Image
            src="/wall-garden-3.jpg"
            alt="Wall Garden Example 3"
            width={300}
            height={200}
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-6 text-center mt-16">
        <p>
          © {new Date().getFullYear()} Natheme — Growing life in every wall 🌿
        </p>
      </footer>
    </main>
  );
}
