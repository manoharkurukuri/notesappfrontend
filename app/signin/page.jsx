"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthstore }  from "../../store/useAuthstore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login ,isLoggingIn,checkAuth,isCheckingAuth,isAuthenticated} = useAuthstore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
      const verifyAuth = async () => {
        await checkAuth(); 
      };

      verifyAuth();
    }, []);
  
    useEffect(() => {
      if (!isCheckingAuth && isAuthenticated) {
        router.push("/community/dashboard");
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res =await login(formData)
      if(res === "success"){
        router.push("community/dashboard")
      }
    } catch (error) {
      toast.error("Login failed")
    }

    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/60 backdrop-blur">
        
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">Login to continue to your notes.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <div className="mt-1 flex items-center rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/40">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-xl cursor-pointer bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition"
          >
            {
              isLoggingIn ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-950" />
              ) : (
                "Login"
              )
            }
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/get-started" className="text-sky-400 hover:text-sky-300 cursor-pointer">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
