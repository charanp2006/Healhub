"use client";
import { useState, useEffect, useContext } from "react";
import { assets } from "@/src/assets/assets";
import { AdminContext } from "@/src/context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    document.title = "Healhub Admin Panel";
  }, []);

  const { setAToken, backendURL } = useContext(AdminContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demoAdminEmail = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL;
  const demoAdminPassword = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD;

  const formatDemoValue = (value, label) =>
    value ? value : `Set ${label} in .env`;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleDemoToggle = () => {
    setShowDemo((prev) => !prev);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const { data } = await axios.post(`${backendURL}/api/admin/login`, {
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("aToken", data.token);
        setAToken(data.token);
        toast.success("Welcome back, Admin!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Login error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img
                src={assets.logo_icon}
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold">
                <span className="text-primary">Heal</span>
                <span className="text-primary">hub</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">Admin Control Panel</p>
          </div>

          <div className="mb-6">
            <div className="w-fit flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
              <Shield size={16} />
              Admin
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mt-3">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
          </div>

          <button
            className="w-full mt-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <button
            type="button"
            onClick={handleDemoToggle}
            className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Demo credentials
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Secure login powered by JWT authentication
          </p>
        </div>
      </form>

      {showDemo && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Demo Credentials
              </p>
              <button
                type="button"
                onClick={handleDemoToggle}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs text-gray-700">
              <div>
                <p className="font-medium text-gray-800">Admin</p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(
                      demoAdminEmail,
                      "NEXT_PUBLIC_DEMO_ADMIN_EMAIL"
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Password:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(
                      demoAdminPassword,
                      "NEXT_PUBLIC_DEMO_ADMIN_PASSWORD"
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;