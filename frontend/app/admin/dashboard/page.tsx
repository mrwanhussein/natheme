// app/admin/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "admin" && decoded.role !== "owner") {
        router.replace("/");
        return;
      }
      setLoading(false);
    } catch {
      router.replace("/signin");
    }
  }, [router]);

  if (loading) return <div className="container-md py-20">Loading...</div>;

  return (
    <div className="container-md py-12">
      <h1 className="text-3xl font-bold text-[var(--brand-500)]">
        Admin Dashboard
      </h1>
      {/* add cards/links to Projects, Catalogs, Users management */}
    </div>
  );
}
