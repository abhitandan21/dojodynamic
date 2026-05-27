import { useState } from "react";

const ResetPassword = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanMobile = mobile.trim();

    if (!cleanMobile || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (cleanMobile.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch( "https://api.amaasa.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: cleanMobile,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Something went wrong.");
        return;
      }

      setMessage(data.msg || "Password reset successfully. Now you can login.");
      setMobile("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 pt-28">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-slate-950">
            Reset Password
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Enter your registered mobile number
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Mobile */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Mobile Number
            </label>

            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-slate-900"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-16 text-base font-semibold tracking-wide text-slate-900 outline-none transition focus:border-slate-900"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600 hover:text-slate-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-16 text-base font-semibold tracking-wide text-slate-900 outline-none transition focus:border-slate-900"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600 hover:text-slate-900"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              {message}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-950 px-4 py-3 font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <a
            href="/login"
            className="text-sm font-bold text-slate-700 hover:text-slate-950"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;