"use client";

// NOTE: Component for the MOBILE layer only. Currently UNWIRED (not rendered
// anywhere) — see the mobile/desktop layer-separation plan. Adding it to a
// page/layout is the next step, AFTER desktop verification.
//
// Desktop is NOT affected by this component.

import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, UserRound } from "lucide-react";
import { assets } from "@/src/assets/assets";
import { AppContext } from "@/src/context/AppContext";

const MobileAppHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, userData } = useContext(AppContext);

  const isHome = pathname === "/";

  return (
    <div className="mobile-app-bar md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        {isHome ? (
          <div className="flex items-center gap-2">
            <img className="w-8 h-8" src={assets.logo_icon.src} alt="Healhub" />
            <span className="text-xl font-bold text-[#179E8D]">
              Heal<span className="text-[#179E8D]">hub</span>
            </span>
          </div>
        ) : (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[#0F172A] touch-none-outline"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
            <span className="text-[15px] font-medium">Back</span>
          </button>
        )}

        {token && userData ? (
          <button
            onClick={() => router.push("/my-profile")}
            className="p-1.5 touch-none-outline"
            aria-label="Profile"
          >
            <img
              className="w-8 h-8 rounded-full object-cover border border-border-light"
              src={userData.image ? userData.image : assets.upload_icon.src}
              alt=""
            />
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="p-1.5 text-[#179E8D] touch-none-outline"
            aria-label="Login"
          >
            <UserRound size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileAppHeader;