import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Lock, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:4000/api";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));

        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        alert(data.msg);
      }
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900/90 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 sm:-left-40 md:-left-48 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 sm:-right-40 md:-right-48 w-56 sm:w-[400px] h-56 sm:h-[400px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Japanese character - responsive */}
      <div className="absolute right-4 sm:right-8 lg:right-10 top-20 sm:top-1/4 -translate-y-1/2 hidden xl:block">
        <span className="font-display text-[8rem] xl:text-[15rem] text-white/3 select-none">武</span>
      </div>

      <div className="w-full max-w-md sm:max-w-lg space-y-6 sm:space-y-8 relative z-10">
        {/* Back button - responsive */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group text-sm sm:text-base py-2 px-3 -mt-12 sm:-mt-16"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-body uppercase tracking-wider">Back to Home</span>
        </Link>

        {/* Main card - perfect responsive padding */}
        <div className="bg-white/5 sm:bg-card/90 backdrop-blur-xl border border-white/10 sm:border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
          {/* Header - responsive */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-crimson p-4 sm:p-6">
              <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Welcome Back
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-sm mx-auto leading-relaxed px-4 sm:px-0">
              Sign in to continue your martial arts journey with discipline and strength
            </p>
          </div>

          {/* Form - perfect spacing */}
          <div className="space-y-5 sm:space-y-6">
            {/* Mobile Input */}
            <div className="space-y-2 sm:space-y-3">
              <label className="font-body text-xs sm:text-sm uppercase tracking-wider text-gray-400 block">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-4 py-3 bg-white/5 sm:bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base sm:text-lg"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 sm:space-y-3">
              <label className="font-body text-xs sm:text-sm uppercase tracking-wider text-gray-400 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 bg-white/5 sm:bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base sm:text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1 hover:scale-110"
                >
                  {showPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button - perfect responsive height */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || !mobile || !password}
              size="lg"
              className="w-full h-12 sm:h-14 text-sm sm:text-lg font-display tracking-wider uppercase rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-500 shadow-crimson hover:shadow-crimson/50 transition-all duration-300 font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="sm:inline hidden">Signing In...</span>
                  <span className="sm:hidden">Signing...</span>
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          {/* Divider - responsive */}
          <div className="relative flex items-center py-4 sm:py-6 my-6 sm:my-8">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink-0 mx-3 sm:mx-4 text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium px-3 py-1 bg-white/5 rounded-full">
              or
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Footer links - responsive */}
          <div className="text-center space-y-3 pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors underline decoration-1 underline-offset-2"
              >
                Create one now
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              <Link to="/forgot-password" className="text-primary hover:underline hover:underline-offset-2 transition-all">
                Forgot password? Reset here
              </Link>
            </p>
          </div>

          {/* Stats - responsive grid */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 border-t border-white/10 mt-8">
            <div className="text-center">
              <span className="text-xl sm:text-2xl text-red-500 block font-bold">2000+</span>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">Students Trained</p>
            </div>
            <div className="text-center">
              <span className="text-xl sm:text-2xl text-yellow-400 block font-bold">05+</span>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">Years Experience</p>
            </div>
            <div className="text-center">
              <span className="text-xl sm:text-2xl text-primary block font-bold">110+</span>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">Championships</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}