"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  Stethoscope,
  Building2,
  ChevronRight,
  CalendarHeart,
} from "lucide-react";
import { assets } from "@/src/assets/assets";

// Mobile-only hero for the patient app home. Desktop layout is untouched.
const MobileHomeHero = () => {
  const router = useRouter();

  return (
    <div className="md:hidden -mx-4 px-4 pt-2 pb-8 bg-gradient-to-b from-[#0e7a6e] to-[#20c3ae] rounded-b-[36px]">
      <div className="flex items-center justify-between">
        <div className="mt-4">
          <p className="text-white/80 text-sm font-medium">
            Welcome to Healhub
          </p>
          <h1 className="text-white text-2xl font-bold leading-tight mt-1">
            Your Health,
            <br />
            One Hub Away
          </h1>
        </div>
        <div className="relative mt-4">
          <img
            className="w-24 h-24 object-cover rounded-3xl border-2 border-white/30 rotate-3 shadow-lg"
            src={assets.header_img.src}
            alt=""
          />
        </div>
      </div>

      {/* Search shortcut */}
      <button
        onClick={() => router.push("/hospitals")}
        className="w-full flex items-center gap-3 bg-background-card rounded-2xl px-4 py-3.5 mt-6 shadow-md touch-none-outline"
      >
        <Search size={20} className="text-[#20c3ae] flex-shrink-0" />
        <span className="text-sm text-text-dim flex-1 text-left">
          Search hospitals, clinics & doctors
        </span>
        <ChevronRight size={18} className="text-text-dim" />
      </button>

      {/* Quick actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => router.push("/doctors")}
          className="flex-1 flex items-center gap-3 bg-background-card/15 border border-white/25 rounded-2xl px-4 py-3.5 text-white touch-none-outline"
        >
          <Stethoscope size={22} className="text-white" />
          <div className="text-left">
            <p className="text-sm font-semibold leading-tight">Book Doctor</p>
            <p className="text-[11px] text-white/75">Find & slot</p>
          </div>
        </button>
        <button
          onClick={() => router.push("/hospitals")}
          className="flex-1 flex items-center gap-3 bg-background-card/15 border border-white/25 rounded-2xl px-4 py-3.5 text-white touch-none-outline"
        >
          <Building2 size={22} className="text-white" />
          <div className="text-left">
            <p className="text-sm font-semibold leading-tight">Hospitals</p>
            <p className="text-[11px] text-white/75">Near you</p>
          </div>
        </button>
        <button
          onClick={() => router.push("/my-appointments")}
          className="flex-1 flex items-center gap-3 bg-background-card/15 border border-white/25 rounded-2xl px-4 py-3.5 text-white touch-none-outline"
        >
          <CalendarHeart size={22} className="text-white" />
          <div className="text-left">
            <p className="text-sm font-semibold leading-tight">Bookings</p>
            <p className="text-[11px] text-white/75">Track them</p>
          </div>
        </button>
      </div>

      {/* Trust strip */}
      <div className="flex items-center gap-2 mt-6">
        <img
          className="w-20"
          src={assets.group_profiles.src}
          alt="Trusted by patients"
        />
        <p className="text-[13px] text-white/90 leading-snug">
          Trusted by thousands of patients
          <br />
          with verified hospitals & doctors
        </p>
      </div>
    </div>
  );
};

export default MobileHomeHero;