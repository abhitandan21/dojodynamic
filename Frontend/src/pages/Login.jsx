import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Lock, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const BASE_URL = "https://dojodynamic222.onrender.com/api";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));

        if (data.user?.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.msg || data.message || "Login failed");
      }
    } catch (err) {
      setError("Server se connect nahi ho paaya");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-zinc-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[420px] h-[420px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-[420px] h-[420px] bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group text-sm sm:text-base py-2 px-1 mb-4"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-600/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <Lock className="w-9 h-9 sm:w-11 sm:h-11 text-red-500" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Welcome Back
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Sign in to continue to your martial arts dashboard
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full h-14 pl-12 pr-4 bg-white text-black placeholder:text-gray-500 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full h-14 pl-12 pr-12 bg-white text-black placeholder:text-gray-500 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !mobile || !password}
              size="lg"
              className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          <div className="relative flex items-center py-5 my-6">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-4 text-xs text-gray-400 uppercase tracking-wider px-3 py-1 bg-zinc-800 rounded-full">
              or
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-red-400 hover:text-red-300 font-medium underline underline-offset-2"
              >
                Create one now
              </Link>
            </p>

            <p className="text-xs text-gray-400">
              <Link
                to="/forgot-password"
                className="text-red-400 hover:underline underline-offset-2"
              >
                Forgot password? Reset here
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 mt-8">
            <div className="text-center">
              <span className="text-2xl text-red-500 block font-bold">2000+</span>
              <p className="text-xs text-gray-400 mt-1">Students Trained</p>
            </div>
            <div className="text-center">
              <span className="text-2xl text-yellow-400 block font-bold">05+</span>
              <p className="text-xs text-gray-400 mt-1">Years Experience</p>
            </div>
            <div className="text-center">
              <span className="text-2xl text-red-400 block font-bold">110+</span>
              <p className="text-xs text-gray-400 mt-1">Championships</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
