"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  name: string;
  description: string;
  image_urls: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();

        const normalized = data.map((project: any) => ({
          ...project,
          image_urls: Array.isArray(project.image_urls)
            ? project.image_urls
            : (() => {
                try {
                  return JSON.parse(project.image_urls);
                } catch {
                  return (
                    project.image_urls
                      ?.replace(/[{}]/g, "")
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean) || []
                  );
                }
              })(),
        }));

        setProjects(normalized);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 🔄 Auto-switch carousel every 3 seconds
  useEffect(() => {
    if (!selectedProject) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % (selectedProject.image_urls?.length || 1)
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedProject]);

  const nextImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex(
      (prev) => (prev + 1) % selectedProject.image_urls.length
    );
  };

  const prevImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + selectedProject.image_urls.length) %
        selectedProject.image_urls.length
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading projects...
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-gradient-to-b from-[#01363A] to-[#001F21] text-white min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-bold text-[#E7FFCF] mb-6"
        >
          Our Projects
        </motion.h1>
        <p className="text-gray-300 text-lg max-w-xl">
          We’re just getting started! Stay tuned for our upcoming sustainability
          projects that will make a positive impact on our planet 🌍
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#01363A] to-[#001F21] text-white min-h-screen">
      {/* Header Section */}
      <section
        className="relative h-[55vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/projects-hero2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-[#E7FFCF]"
          >
            Our Projects
          </motion.h1>
          <p className="text-gray-200 mt-4 text-lg max-w-2xl mx-auto">
            Explore our journey in building smart, sustainable solutions that
            empower a greener future.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform cursor-pointer relative group"
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              setSelectedProject(project);
              setCurrentImageIndex(0);
            }}
          >
            <div className="relative h-56 w-full overflow-hidden">
              {project.image_urls.length > 0 ? (
                <motion.img
                  src={project.image_urls[0]}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  View More →
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[#E7FFCF] mb-2">
                {project.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Modal for Project Details */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#01383D] text-white rounded-3xl p-8 max-w-4xl w-full relative shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-3xl font-light"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>

              {/* Project Title and Description */}
              <h2 className="text-4xl font-bold text-[#E7FFCF] mb-4 text-center">
                {selectedProject.name}
              </h2>
              <p className="text-gray-300 mb-6 text-center text-lg">
                {selectedProject.description}
              </p>

              {/* Carousel */}
              {selectedProject.image_urls.length > 0 && (
                <div className="relative w-full h-[450px] overflow-hidden rounded-2xl shadow-lg">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedProject.image_urls[currentImageIndex]}
                    alt={`Project image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Arrows */}
                  {selectedProject.image_urls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 text-2xl"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 text-2xl"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Dots */}
              {selectedProject.image_urls.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {selectedProject.image_urls.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full cursor-pointer ${
                        index === currentImageIndex
                          ? "bg-[#E7FFCF]"
                          : "bg-gray-500"
                      }`}
                    ></span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
