"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

type SignupResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    location?: string;
  };
  token: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post<SignupResponse>(
        "http://localhost:5000/api/auth/signup",
        formData
      );
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/auth-bg.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/20">
        <Image
          src="/finallogo.svg"
          alt="Natheme"
          width={64}
          height={64}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-[#E7FFCF] mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone "
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
          />
          <input
            type="text"
            name="location"
            placeholder="Location "
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E7FFCF] text-[#01363A] font-semibold py-3 rounded-lg hover:bg-[#c4f5a2] transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-[#E7FFCF]/80 mt-4 text-sm">
          Already have an account?{" "}
          <a href="/signin" className="underline text-[#E7FFCF]">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
