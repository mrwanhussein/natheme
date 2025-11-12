"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Decoded = { id?: number; email?: string; role?: string; exp?: number };

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showProjects, setShowProjects] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🧠 Check authentication
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAdmin(false);
          setUserEmail(null);
          return;
        }
        const decoded = jwtDecode<Decoded>(token);
        setUserEmail(decoded?.email || null);
        setIsAdmin(decoded?.role === "admin" || decoded?.role === "owner");
      } catch {
        setIsAdmin(false);
        setUserEmail(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  // 🧩 Check if projects exist
  useEffect(() => {
    const checkProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();
        if (!data || data.length === 0) setShowProjects(false);
      } catch {
        setShowProjects(false);
      }
    };
    checkProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
    setIsAdmin(false);
    setMobileMenuOpen(false);
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <li>
        <Link
          href="/"
          className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
          onClick={handleMobileLinkClick}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/solutions"
          className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
          onClick={handleMobileLinkClick}
        >
          Solutions
        </Link>
      </li>
      {showProjects && (
        <li>
          <Link
            href="/projects"
            className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
            onClick={handleMobileLinkClick}
          >
            Projects
          </Link>
        </li>
      )}
      <li>
        <Link
          href="/about"
          className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
          onClick={handleMobileLinkClick}
        >
          About
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
          onClick={handleMobileLinkClick}
        >
          Contact
        </Link>
      </li>
      {isAdmin && (
        <li>
          <Link
            href="/admin/dashboard"
            className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
            onClick={handleMobileLinkClick}
          >
            Admin
          </Link>
        </li>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-[#01363A]/80 to-transparent shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/finallogo.svg" alt="Natheme" width={44} height={44} />
          <span className="text-2xl font-bold text-[var(--brand-500)]">
            Natheme
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-8 text-[#E7FFCF] text-lg font-medium items-center">
        {navLinks}
        <li>
          {!userEmail ? (
            <Link
              href="/signin"
              className="text-[#01363A] bg-[#E7FFCF] px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_12px_#E7FFCF] hover:bg-[#d3ffad] hover:scale-105 transition-all duration-300"
            >
              Sign in
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-[#01363A] bg-[#E7FFCF] px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_12px_#E7FFCF] hover:bg-[#d3ffad] hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          )}
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#E7FFCF] font-bold text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown with Animation */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-[#01363A]/95 flex flex-col gap-4 p-6 transform transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-4 text-[#E7FFCF] text-lg font-medium">
          {navLinks}
          <li>
            {!userEmail ? (
              <Link
                href="/signin"
                className="block w-full text-center text-[#01363A] bg-[#E7FFCF] px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_12px_#E7FFCF] hover:bg-[#d3ffad] hover:scale-105 transition-all duration-300"
                onClick={handleMobileLinkClick}
              >
                Sign in
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center text-[#01363A] bg-[#E7FFCF] px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_12px_#E7FFCF] hover:bg-[#d3ffad] hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
