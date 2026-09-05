"use client";

import React from "react";
import { LOGO, LOGO_ALT } from "@healhub/ui/images";
import { ThemeToggle } from "@healhub/ui/theme";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import { DoctorContext } from "@/src/context/DoctorContext";
import { HospitalContext } from "@/src/context/HospitalContext";

const Navbar = () => {
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

  return (
    <div className="flex justify-between items-center text-sm py-3 px-4 sm:px-10 border-b border-b-border-light ">
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center text-xs cursor-pointer">
          <img
            onClick={() => router.push("/")}
            className="w-10 h-8.5 mr-0.5"
            src={LOGO}
            alt={LOGO_ALT}
          />
          <span className="text-3xl font-bold text-[#179E8D]">Heal</span>
          <span className="text-3xl font-bold text-[#179E8D]">hub</span>
        </div>
        <p className="border px-2.5 py-0.5 rounded-full border-border text-text-secondary">
          {hToken ? "Clinic" : dToken ? "Doctor" : "Clinic"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={logout}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full hover:text-text-primary cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
