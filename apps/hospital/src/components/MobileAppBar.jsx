"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LogOut } from "lucide-react";
import { assets } from "@/src/assets/assets";
import { AdminContext } from "@/src/context/AdminContext";
import { DoctorContext } from "@/src/context/DoctorContext";
import { HospitalContext } from "@/src/context/HospitalContext";

// Mobile-only sticky app bar for the clinic portal. Desktop layout is untouched.
const MobileAppBar = () => {
  const router = useRouter();

  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const { hToken, setHToken } = useContext(HospitalContext);

  const logout = () => {
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    if (hToken) {
      setHToken("");
      localStorage.removeItem("hToken");
    }
    router.push("/");
  };

  const home = dToken ? "/doctor-dashboard" : "/hospital-dashboard";
  const role = hToken ? "Clinic" : "Doctor";

  return (
    <div className="mobile-app-bar md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={() => router.push(home)}
          className="flex items-center gap-2 touch-none-outline"
          aria-label="Home"
        >
          <img className="w-8 h-8" src={assets.logo_icon} alt="Healhub" />
          <span className="text-xl font-bold text-[#179E8D]">
            Heal<span className="text-[#179E8D]">hub</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center text-xs px-2.5 py-1 rounded-full bg-[#eefaf8] text-[#179E8D] font-medium">
            {role}
          </span>
          <button
            onClick={logout}
            className="p-2 rounded-full bg-[#fdeeee] text-[#e5544f] touch-none-outline"
            aria-label="Logout"
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAppBar;