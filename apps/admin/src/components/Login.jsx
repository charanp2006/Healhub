"use client";
import { useState, useEffect, useContext } from "react";
import { assets } from "@/src/assets/assets";
import { AdminContext } from "@/src/context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "@/src/context/DoctorContext";
import { HospitalContext } from "@/src/context/HospitalContext";
import {
  Eye,
  EyeOff,
  Shield,
  Building2,
  Stethoscope,
  Loader2,
} from "lucide-react";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    document.title = "Healhub Panel";
  }, []);

  const { setAToken, backendURL } = useContext(AdminContext);
  const { setDToken, backendURL: doctorBackendURL } = useContext(DoctorContext);
  const { setHToken } = useContext(HospitalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demoAdminEmail = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL;
  const demoAdminPassword = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD;
  const demoHospitalEmail = process.env.NEXT_PUBLIC_DEMO_HOSPITAL_EMAIL;
  const demoHospitalPassword = process.env.NEXT_PUBLIC_DEMO_HOSPITAL_PASSWORD;
  const demoDoctorEmail = process.env.NEXT_PUBLIC_DEMO_DOCTOR_EMAIL;
  const demoDoctorPassword = process.env.NEXT_PUBLIC_DEMO_DOCTOR_PASSWORD;

  const formatDemoValue = (value, label) =>
    value ? value : `Set ${label} in .env`;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedRole = localStorage.getItem("rememberedRole");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    if (rememberedRole) {
      setState(rememberedRole);
    }
  }, []);

  const handleRoleChange = (role) => {
    setState(role);
    setPassword("");
    setShowPassword(false);
  };

  const handleDemoToggle = () => {
    setShowDemo((prev) => !prev);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedRole", state);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedRole");
      }

      if (state === "Admin") {
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
      } else if (state === "Hospital") {
        const { data } = await axios.post(`${doctorBackendURL}/api/hospital/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("hToken", data.token);
          setHToken(data.token);
          toast.success("Welcome back!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${doctorBackendURL}/api/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Welcome back, Doctor!");
        } else {
          toast.error(data.message);
        }
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

  const roleConfig = {
    Admin: {
      icon: Shield,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-500",
    },
    Hospital: {
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-500",
    },
    Doctor: {
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-500",
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={assets.logo_icon} alt="Logo" className="h-10" />
              <span className="text-2xl font-bold">
                <span className="text-primary">Heal</span>
                <span className="text-primary">hub</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">Management Portal</p>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            {["Admin", "Hospital", "Doctor"].map((role) => {
              const RoleIcon = roleConfig[role].icon;
              const isActive = state === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `bg-white shadow-sm ${roleConfig[role].color}`
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <RoleIcon size={16} />
                  <span className="hidden sm:inline">{role}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {state} Login
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to access the {state.toLowerCase()}{" "}
              dashboard
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
                    {formatDemoValue(demoAdminEmail, "NEXT_PUBLIC_DEMO_ADMIN_EMAIL")}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Password:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(
                      demoAdminPassword,
                      "NEXT_PUBLIC_DEMO_ADMIN_PASSWORD",
                    )}
                  </span>
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Hospital</p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(
                      demoHospitalEmail,
                      "NEXT_PUBLIC_DEMO_HOSPITAL_EMAIL",
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Password:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(
                      demoHospitalPassword,
                      "NEXT_PUBLIC_DEMO_HOSPITAL_PASSWORD",
                    )}
                  </span>
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Doctor</p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(demoDoctorEmail, "NEXT_PUBLIC_DEMO_DOCTOR_EMAIL")}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Password:</span>{" "}
                  <span className="font-mono text-gray-800">
                    {formatDemoValue(
                      demoDoctorPassword,
                      "NEXT_PUBLIC_DEMO_DOCTOR_PASSWORD",
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
