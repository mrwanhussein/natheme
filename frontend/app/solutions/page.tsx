"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SolutionsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/catalogs");
        setCatalogs(response.data as any[]);
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      }
    };
    fetchCatalogs();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    appendDots: (dots: any) => (
      <div style={{ position: "absolute", bottom: "-40px", width: "88%" }}>
        <ul className="flex justify-center space-x-2 m-0 p-0">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-gray-400 rounded-full hover:bg-[#E7FFCF] transition-colors"></div>
    ),
  };

  return (
    <div className="bg-gradient-to-b from-[#01363A] to-[#001F21] text-white min-h-screen">
      {/* 🌿 Hero Section */}
      <section
        className="relative h-[55vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/solutions-bg.jpg')" }} // Directly from /public
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-[#E7FFCF]"
          >
            Our Solutions
          </motion.h1>
          <p className="text-gray-200 mt-4 text-lg max-w-2xl mx-auto">
            Discover how we transform innovation into sustainability — from
            smart green walls and eco-friendly systems to intelligent
            architecture that reshapes the future 🌱
          </p>
        </div>
      </section>

      {/* 🏡 Home Walls Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-10 py-24 gap-10 bg-[#01383D]/80 backdrop-blur-sm rounded-[2rem] mx-6 mt-10 overflow-hidden">
        <div className="w-full md:w-1/2 relative">
          <Slider {...sliderSettings}>
            {[
              "/home-walls-1.jpg",
              "/home-walls-2.jpg",
              "/home-walls-3.jpg",
            ].map((img, i) => (
              <div key={i} className="flex justify-center">
                <Image
                  src={img}
                  alt={`Home Wall ${i + 1}`}
                  width={500}
                  height={350}
                  className="rounded-2xl shadow-lg border-2 border-[#E7FFCF] object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold text-[#E7FFCF] mb-4">
            Planting Walls at Home
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed">
            Create a natural oasis inside your home with our elegant green wall
            systems. Designed for both aesthetics and health, they purify air,
            reduce stress, and bring vibrant life to your living spaces.
          </p>
        </div>
      </section>

      {/* 🏢 Building Walls Section */}
      <section className="relative flex flex-col md:flex-row-reverse items-center justify-between px-10 py-24 gap-10 bg-[#00292B]/90 backdrop-blur-sm rounded-[2rem] mx-6 mt-10 overflow-hidden">
        <div className="w-full md:w-1/2 relative">
          <Slider {...sliderSettings}>
            {[
              "/building-walls-1.jpg",
              "/building-walls-2.jpg",
              "/building-walls-3.jpg",
            ].map((img, i) => (
              <div key={i} className="flex justify-center">
                <Image
                  src={img}
                  alt={`Building Wall ${i + 1}`}
                  width={500}
                  height={350}
                  className="rounded-2xl shadow-lg border-2 border-[#E7FFCF] object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold text-[#E7FFCF] mb-4">
            Planting Walls for Buildings
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed">
            Enhance your architectural vision with sustainable vertical gardens.
            Our green façades reduce heat, improve air quality, and create
            eco-friendly structures that inspire.
          </p>
        </div>
      </section>

      {/* 📘 Catalogs Section */}
      <section className="py-24">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl font-bold text-[#E7FFCF] mb-16"
        >
          Download Our Catalogs
        </motion.h2>

        {catalogs.map((catalog, index) => (
          <motion.section
            key={catalog.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row items-center justify-between px-10 py-16 gap-10 mx-6 mb-12 rounded-[2rem] ${
              index % 2 === 0
                ? "bg-[#01383D]/90 text-[#E7FFCF]"
                : "bg-[#00292B]/80 text-[#E7FFCF]"
            }`}
          >
            {/* Catalog Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/catalog-image.jpg" // replace with your actual image name in /public
                alt="Catalog"
                width={500}
                height={350}
                className="rounded-2xl shadow-lg border-2 border-[#E7FFCF]"
              />
            </div>

            {/* Catalog Info */}
            <div className="max-w-xl">
              <h3 className="text-3xl font-semibold mb-4">{catalog.title}</h3>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                {catalog.description}
              </p>
              <a
                href={`http://localhost:5000/${catalog.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E7FFCF] text-[#01363A] px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform hover:shadow-[#E7FFCF]/40"
              >
                Download Catalog
              </a>
            </div>
          </motion.section>
        ))}
      </section>
    </div>
  );
}
