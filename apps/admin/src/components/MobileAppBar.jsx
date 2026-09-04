"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { assets } from "@/src/assets/assets";
import { AdminContext } from "@/src/context/AdminContext";

// Mobile-only sticky app bar. Desktop layout is untouched.
const MobileAppBar = () => {
  const router = useRouter();
  const { setAToken } = useContext(AdminContext);

  const logout = () => {
    setAToken("");
    localStorage.removeItem("aToken");
    router.push("/");
  };

  return (
    <div className="mobile-app-bar md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={() => router.push("/admin-dashboard")}
          className="flex items-center gap-2 touch-none-outline"
          aria-label="Home"
        >
          <img className="w-8 h-8" src={assets.logo_icon} alt="Healhub" />
          <span className="text-xl font-bold text-[#179E8D]">
            Heal<span className="text-[#179E8D]">hub</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#eefaf8] text-[#179E8D] font-medium">
            <ShieldCheck size={13} />
            Admin
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