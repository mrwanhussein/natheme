// app/layout.tsx

import "./globals.css";
import React from "react";
import Navbar from "../app/components/ Navbar";
import Footer from "../app/components/Footer";

export const metadata = {
  title: "Natheme",
  description: "Natheme — Growing life in every wall",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#01363A] text-white min-h-screen font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
