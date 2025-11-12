"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let fadeTimer: number | undefined;

    async function fetchAndDrawSVG() {
      try {
        const res = await fetch("/finallogo.svg");
        const svgText = await res.text();

        if (!svgContainerRef.current) return;
        svgContainerRef.current.innerHTML = svgText;

        const svgEl = svgContainerRef.current.querySelector("svg");
        if (!svgEl) return;

        svgEl.setAttribute("width", "220");
        svgEl.setAttribute("height", "180");
        svgEl.setAttribute("viewBox", "0 0 440 370");
        svgEl.style.display = "block";

        const shapes = Array.from(
          svgEl.querySelectorAll<SVGGeometryElement>(
            "path, circle, rect, polyline, polygon, line"
          )
        );

        shapes.forEach((el) => {
          el.style.stroke = "#A4E96C";
          el.style.strokeWidth = "3";
          el.style.strokeLinecap = "round";
          el.style.strokeLinejoin = "round";

          if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
            (el as SVGElement).style.fillOpacity = "0";
          } else {
            el.setAttribute("fill", "none");
          }

          try {
            const len = (el as any).getTotalLength?.() ?? 200;
            el.style.strokeDasharray = `${len}`;
            el.style.strokeDashoffset = `${len}`;
          } catch {
            el.style.strokeDasharray = "200";
            el.style.strokeDashoffset = "200";
          }
        });

        const baseDuration = 1200;
        shapes.forEach((el, i) => {
          const delay = i * 70;
          const len = parseFloat(el.style.strokeDasharray || "200");
          const dur = Math.max(600, Math.min(1800, (len / 300) * baseDuration));

          setTimeout(() => {
            el.style.transition = `stroke-dashoffset ${dur}ms ease-in-out`;
            el.style.strokeDashoffset = "0";
            setTimeout(() => {
              (el as SVGElement).style.transition =
                "fill-opacity 400ms ease-in-out, stroke-width 600ms ease-in-out";
              (el as SVGElement).style.fillOpacity = "1";
              el.style.strokeWidth = "1.5";
            }, dur - 150);
          }, delay);
        });

        const totalDrawingTime = shapes.length * 70 + baseDuration + 1000;
        fadeTimer = window.setTimeout(() => {
          setShowIntro(false);
        }, totalDrawingTime);
      } catch {
        fadeTimer = window.setTimeout(() => setShowIntro(false), 2000);
      }
    }

    fetchAndDrawSVG();
    return () => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <main className="relative min-h-screen text-white overflow-hidden font-sans">
      {/* 🌿 INTRO ANIMATION */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#01363A]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              ref={svgContainerRef}
              className="w-[240px] h-[200px] flex items-center justify-center"
            />
            <motion.h1
              className="text-4xl font-bold text-[#A4E96C] mt-6 tracking-widest"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              NATHEME
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌱 MAIN CONTENT */}
      {!showIntro && (
        <>
          {/* HERO SECTION */}
          <section className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover brightness-[0.65] contrast-110 saturate-125"
            >
              <source src="/greenwall-bg.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-[#01363A]/50" />

            <div className="relative z-10 px-6 md:px-12 flex flex-col items-center">
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold text-[#A4E96C] mb-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Growing Life in Every Wall 🌿
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-[#E7FFCF] max-w-2xl mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                Where design meets sustainability — Natheme turns your walls
                into living, breathing ecosystems that bring wellness and beauty
                to every space.
              </motion.p>

              <motion.a
                href="/solutions"
                className="bg-[#A4E96C] text-[#01363A] px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#D7FCA2] transition"
                whileHover={{ scale: 1.05 }}
              >
                Explore Our Solutions
              </motion.a>
            </div>
          </section>

          {/* WHY NATHEME SECTION */}
          <section className="relative py-28 px-6 md:px-20 bg-gradient-to-br from-[#01363A] via-[#024941] to-[#01363A] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#A4E96C15,transparent_75%)]"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(164,233,108,0.2)]"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <Image
                  src="/plants-wall-new-v3.jpg"
                  alt="Natheme Vertical Garden"
                  fill
                  className="object-cover scale-105 hover:scale-110 transition-transform duration-700 ease-out"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#A4E96C]">
                  Why Choose Natheme?
                </h2>
                <p className="text-lg text-[#E7FFCF]/90 mb-8 leading-relaxed">
                  At Natheme, innovation and nature come together to redefine
                  architecture. Our vertical gardens combine modular design with
                  smart irrigation, turning any surface into a thriving green
                  space.
                </p>

                <ul className="space-y-5 text-lg">
                  {[
                    "Purifies air and boosts wellbeing 🌿",
                    "Sustainable modular systems 🏗️",
                    "Automated watering for zero hassle 💧",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3 text-[#E7FFCF]"
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.2, duration: 0.8 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="/solutions"
                  className="inline-block mt-10 bg-[#A4E96C] text-[#01363A] px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#D7FCA2]"
                  whileHover={{ scale: 1.05 }}
                >
                  Discover More
                </motion.a>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
