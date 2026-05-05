"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthstore } from "../../store/useAuthstore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const {register,isSigningUp,checkAuth,isCheckingAuth,isAuthenticated} = useAuthstore();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
        const verifyAuth = async () => {
          await checkAuth(); 
        };
  
        verifyAuth();
      }, []);
    
      useEffect(() => {
        if (!isCheckingAuth && isAuthenticated) {
          router.push("/dashboard");
        }
      }, [isCheckingAuth, isAuthenticated, router]);
  
      if (isCheckingAuth) {
        return (
          <div className="flex items-center justify-center h-screen bg-slate-950 px-4 text-white">
            Checking authentication...
          </div>
        );
      }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
         if(!formData.fullName || !formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
         }
         try {
           await register(formData);
            router.push("/signin"); 
            
         } catch (error) {
            console.log("Registration error:", error);
            toast.error("Registration failed");
         }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/60 backdrop-blur">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Start organizing your notes in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-200"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-sky-500/40 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-sky-500/40 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2"
            />
          </div>

          {/* Password + Show/Hide */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <div className="mt-1 flex items-center rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/40">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Use at least 8 characters with letters and numbers.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-xl cursor-pointer bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition"
          >
            {isSigningUp ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-950" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer text */}
        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/signin" className="cursor-pointer font-medium text-sky-400 hover:text-sky-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
