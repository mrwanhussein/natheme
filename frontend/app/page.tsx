"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

/**
 * HomePage with SVG "draw" intro.
 * Put your SVG at: /public/finallogo.svg
 */
export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // total intro duration: drawing + hold before fade out
    // we will fade out after the drawing finishes
    let fadeTimer: number | undefined;

    async function fetchAndDrawSVG() {
      try {
        const res = await fetch("/finallogo.svg");
        const svgText = await res.text();

        if (!svgContainerRef.current) return;

        // inject raw SVG
        svgContainerRef.current.innerHTML = svgText;

        // select the actual <svg> element we just injected
        const svgEl = svgContainerRef.current.querySelector("svg");
        if (!svgEl) return;

        // Make sure SVG scales nicely in the intro box
        svgEl.setAttribute("width", "220");
        svgEl.setAttribute("height", "180");
        svgEl.setAttribute(
          "viewBox",
          svgEl.getAttribute("viewBox") || "0 0 440 370"
        );
        svgEl.style.display = "block";

        // For each path (and optionally polyline, line, circle) set up stroke animation
        const pathSelector = "path, circle, rect, polyline, polygon, line";
        const shapes = Array.from(
          svgEl.querySelectorAll<SVGGeometryElement>(pathSelector)
        );

        // If there are groups with fill colors, we will:
        // - create an overlaid stroke (clone) to draw the outline, then reveal fill after drawing
        // But simpler: convert paths to stroked paths for drawing, preserve fills after.
        shapes.forEach((el) => {
          // set stroke color to your brand accent and stroke width for the drawing effect
          // if the path already has a fill that's fine — we'll stroke over it, but set stroke to accent
          el.style.stroke = "#A4E96C";
          el.style.strokeWidth = "3";
          el.style.strokeLinecap = "round";
          el.style.strokeLinejoin = "round";

          // preserve existing fill but make drawing visible by temporarily reducing fill opacity
          if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
            el.setAttribute("data-fill", el.getAttribute("fill") || "");
            el.setAttribute("fill", el.getAttribute("fill") || "");
            // temporarily reduce fill opacity so stroke drawing is visible
            (el as SVGElement).style.fillOpacity = "0";
          } else {
            el.setAttribute("fill", "none");
          }

          // compute path length and initialize dasharray/dashoffset
          try {
            // some elements (like rect, circle) also support getTotalLength
            const len = (el as any).getTotalLength?.();
            if (typeof len === "number" && !Number.isNaN(len)) {
              el.style.transition = "none";
              el.style.strokeDasharray = `${len}`;
              el.style.strokeDashoffset = `${len}`;
              // ensure will-change to improve performance
              el.style.willChange = "stroke-dashoffset";
            } else {
              // fallback: small dash to show stroke
              el.style.strokeDasharray = "200";
              el.style.strokeDashoffset = "200";
            }
          } catch (e) {
            // ignore if getTotalLength not supported
            el.style.strokeDasharray = "200";
            el.style.strokeDashoffset = "200";
          }
        });

        // Animate strokeDashoffset -> 0 with a stagger
        // Use setTimeout to stagger each element
        const baseDuration = 1300; // ms for each path (approx)
        shapes.forEach((el, i) => {
          const delay = i * 60; // stagger between paths
          const lenStr = el.style.strokeDasharray || "200";
          const len = parseFloat(lenStr.split(" ")[0]) || 200;
          // target duration scaled by length
          const dur = Math.max(500, Math.min(2200, (len / 300) * baseDuration));

          // set transition
          setTimeout(() => {
            el.style.transition = `stroke-dashoffset ${dur}ms ease-in-out`;
            el.style.strokeDashoffset = "0";

            // after stroke completes, reveal fill smoothly
            setTimeout(() => {
              // restore fill (fade it in)
              (el as SVGElement).style.transition =
                "fill-opacity 400ms ease-in-out";
              (el as SVGElement).style.fillOpacity = "1";
              // optionally make stroke thinner after drawing
              el.style.transition += `, stroke-width 600ms ease-in-out`;
              el.style.strokeWidth = "1.5";
              // you can also fade stroke color a bit if you like
              // el.style.stroke = "rgba(164,233,108,0.85)";
            }, dur - 120); // start fill reveal slightly before stroke finishes
          }, delay);
        });

        // compute when drawing ends (last path delay + its dur)
        const lastIndex = Math.max(0, shapes.length - 1);
        const lastLen = (() => {
          const el = shapes[lastIndex];
          const s = el?.style.strokeDasharray || "200";
          return parseFloat(s.split(" ")[0]) || 200;
        })();
        const lastDur = Math.max(
          500,
          Math.min(2200, (lastLen / 300) * baseDuration)
        );
        const totalDrawingTime = lastIndex * 60 + lastDur;

        // keep intro visible for drawing plus a little hold (0.9s), then fade
        fadeTimer = window.setTimeout(() => {
          setShowIntro(false);
        }, totalDrawingTime + 900);
      } catch (err) {
        console.error("Failed loading/drawing SVG:", err);
        // fallback: short timeout
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
      {/* 🌱 INTRO LOGO DRAWING ANIMATION */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#01363A]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            aria-hidden={!showIntro}
          >
            {/* Container where we inject and draw the SVG */}
            <div
              ref={svgContainerRef}
              className="w-[240px] h-[200px] flex items-center justify-center"
              style={{ willChange: "contents" }}
            >
              {/* SVG will be injected here from /finallogo.svg */}
            </div>

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

      {/* 🌿 MAIN PAGE CONTENT */}
      {!showIntro && (
        <>
          {/* HERO SECTION */}
          <section
            id="home"
            className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden"
          >
            {/* Background video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-110 saturate-125"
            >
              <source src="/greenwall-bg.mp4" type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#01363A]/60"></div>

            {/* Content */}
            <div className="relative z-10 px-6 md:px-12 flex flex-col items-center">
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold text-[#A4E96C] mb-4"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Growing Life in Every Wall 🌱
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-[#E7FFCF] max-w-2xl mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                Bringing sustainable design and nature together — Natheme
                transforms your walls into living ecosystems.
              </motion.p>

              <motion.a
                href="/solutions"
                className="bg-[#A4E96C] text-[#01363A] px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#E7FFCF] transition"
                whileHover={{ scale: 1.05 }}
              >
                Explore Our Solutions
              </motion.a>
            </div>
          </section>

          {/* 🌿 WHY NATHEME SECTION (Redesigned) */}
          <section
            id="why"
            className="relative py-28 px-6 md:px-20 bg-gradient-to-br from-[#01363A] via-[#02504A] to-[#01363A] overflow-hidden"
          >
            {/* Animated particles */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#A4E96C20,transparent_70%)]"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Left Image */}
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

              {/* Right Text */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#A4E96C]">
                  Why Choose Natheme?
                </h2>
                <motion.p
                  className="text-lg text-[#E7FFCF]/90 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                >
                  At Natheme, we merge art and nature. Our vertical gardens turn
                  walls into vibrant ecosystems, creating wellness, beauty, and
                  sustainability in every design.
                </motion.p>

                <ul className="space-y-5 text-lg">
                  {[
                    { icon: "🌿", text: "Purifies air and uplifts wellbeing." },
                    { icon: "🏗️", text: "Sustainable modular architecture." },
                    {
                      icon: "💧",
                      text: "Smart irrigation for easy maintenance.",
                    },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
                    >
                      <span className="text-2xl text-[#A4E96C]">
                        {item.icon}
                      </span>
                      <p className="text-[#E7FFCF]/95">{item.text}</p>
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="/solutions"
                  className="inline-block mt-10 bg-[#A4E96C] text-[#01363A] px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#E7FFCF]"
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
