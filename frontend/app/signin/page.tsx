"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios"; // remove { AxiosResponse }

type SigninResponse = {
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

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      // ✅ Use generics to type response
      const res = await axios.post<SigninResponse>(
        "http://localhost:5000/api/auth/signin",
        formData
      );

      // ✅ TypeScript knows res.data is SigninResponse
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
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
        <h1 className="text-2xl font-bold text-[#E7FFCF] mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E7FFCF]"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E7FFCF] text-[#01363A] font-semibold py-3 rounded-lg hover:bg-[#c4f5a2] transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-[#E7FFCF]/80 mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="underline text-[#E7FFCF]">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
