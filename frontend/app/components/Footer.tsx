"use client";
import { FaLinkedin, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";
  const isAuthPage = pathname === "/signin" || pathname === "/signup"; // detect auth pages

  return (
    <footer
      className={`bg-[#01292B] text-white py-14 border-t border-white/10 ${
        isAuthPage ? "mt-0" : "mt-24"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-10 items-center">
        {/* Left - Logo & Intro */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#E7FFCF] mb-3">Natheme</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering sustainability through smart technology — building a
            greener tomorrow.
          </p>
        </div>

        {/* Center - Social Media Icons */}
        <div className="flex justify-center gap-6">
          <a
            href="https://linkedin.com"
            target="_blank"
            className="hover:text-[#E7FFCF] transition"
          >
            <FaLinkedin size={30} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-[#E7FFCF] transition"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            className="hover:text-[#E7FFCF] transition"
          >
            <FaTiktok size={30} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-[#E7FFCF] transition"
          >
            <FaFacebook size={30} />
          </a>
        </div>

        {/* Right - Contact Info */}
        <div className="text-center md:text-right">
          <p className="text-gray-400 text-sm">📧 contact@natheme.com</p>
          <p className="text-gray-400 text-sm">📞 +20 100 000 0000</p>

          <Link
            href={isContactPage ? "/about" : "/contact"}
            className="inline-block mt-4 bg-[#E7FFCF] text-[#01363A] px-6 py-2.5 rounded-full font-semibold hover:bg-[#c4f5a2] transition"
          >
            {isContactPage ? "About Us" : "Contact Us"}
          </Link>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-white/10 pt-5">
        © {new Date().getFullYear()} Natheme. All rights reserved.
      </div>
    </footer>
  );
}
