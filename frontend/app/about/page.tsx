"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-[#01363A] to-[#001F21] text-white">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/about-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold text-[#E7FFCF]"
          >
            About Natheme
          </motion.h1>
          <p className="text-lg mt-4 text-gray-200 max-w-2xl mx-auto">
            Where innovation meets sustainability. Learn more about who we are
            and what drives us.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row items-center gap-10"
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Image
          src="/vision.jpg"
          alt="Our Vision"
          width={500}
          height={320}
          className="rounded-2xl shadow-lg object-cover"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-[#E7FFCF]">
            Our Vision
          </h2>
          <p className="text-gray-300 leading-relaxed">
            To create a world where technology and sustainability walk hand in
            hand — empowering a new generation of green innovators who transform
            challenges into opportunities.
          </p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col-reverse md:flex-row items-center gap-10"
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-[#E7FFCF]">
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Our mission is to engineer smart, accessible, and eco-friendly
            technologies that inspire positive change and drive real-world
            sustainability solutions.
          </p>
        </div>
        <Image
          src="/mission2.jpg"
          alt="Our Mission"
          width={500}
          height={320}
          className="rounded-2xl shadow-lg object-cover"
        />
      </motion.section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-8 text-[#E7FFCF]">
          Our Story
        </h2>
        <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed">
          Natheme was founded with one clear goal: to bridge the gap between
          innovation and nature. From our humble beginnings, we’ve grown into a
          passionate team dedicated to environmental impact, sustainability, and
          technological advancement.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-6 justify-items-center">
          {["team.jpg", "research2.jpg", "innovation.jpg"].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Image
                src={`/${img}`}
                alt="Natheme"
                width={320}
                height={220}
                className="rounded-xl shadow-md object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-12 text-[#E7FFCF]">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Innovation",
              desc: "Pioneering creative solutions that reshape the future.",
              icon: "💡",
            },
            {
              title: "Integrity",
              desc: "Doing what’s right — always, for people and the planet.",
              icon: "🤝",
            },
            {
              title: "Sustainability",
              desc: "Building for tomorrow without compromising today.",
              icon: "🌿",
            },
          ].map((val, i) => (
            <motion.div
              key={i}
              className="bg-white/10 border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{val.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#E7FFCF]">
                {val.title}
              </h3>
              <p className="text-gray-300 text-sm">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
