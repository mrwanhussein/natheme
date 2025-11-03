"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Decoded = { id?: number; email?: string; role?: string; exp?: number };

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail(null);
    setIsAdmin(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-[#01363A]/80 to-transparent">
      {/* Logo Section */}
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
        {[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Projects", path: "/projects" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ].map((item) => (
          <li key={item.name}>
            <Link
              className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
              href={item.path}
            >
              {item.name}
            </Link>
          </li>
        ))}

        {isAdmin && (
          <li>
            <Link
              className="nav-link relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#E7FFCF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-[#c4f5a2] transition-colors duration-300"
              href="/admin/dashboard"
            >
              Admin
            </Link>
          </li>
        )}

        {/* Auth Buttons — 🪄 Rounded Stylish Design */}
        {!userEmail ? (
          <li>
            <Link
              href="/signin"
              className="text-[#01363A] bg-[#E7FFCF] px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_12px_#E7FFCF] hover:bg-[#d3ffad] hover:scale-105 transition-all duration-300"
            >
              Sign in
            </Link>
          </li>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className="text-[#01363A] bg-[#E7FFCF] px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-[0_0_12px_#E7FFCF] hover:bg-[#d3ffad] hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {!userEmail ? (
          <Link
            href="/signin"
            className="text-[#E7FFCF] font-medium hover:text-[#c4f5a2] transition-colors duration-300"
          >
            Sign in
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="text-[#E7FFCF] font-medium hover:text-[#c4f5a2] transition-colors duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
