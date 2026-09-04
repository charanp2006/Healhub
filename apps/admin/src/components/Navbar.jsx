"use client";
import { assets } from "@/src/assets/assets";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AdminContext } from "@/src/context/AdminContext";

const Navbar = () => {
  const router = useRouter();
  const { setAToken } = useContext(AdminContext);

  const logout = () => {
    setAToken("");
    localStorage.removeItem("aToken");
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center text-sm py-3 px-4 sm:px-10 border-b border-b-border-light ">
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center text-xs cursor-pointer">
          <img
            onClick={() => router.push("/")}
            className="w-10 h-10 mr-0.5"
            src={assets.logo_icon}
            alt="Healhub"
          />
          <span className="text-3xl font-bold text-[#179E8D]">Heal</span>
          <span className="text-3xl font-bold text-[#179E8D]">hub</span>
        </div>
        <p className="border px-2.5 py-0.5 rounded-full border-border-light text-text-secondaryLight">
          Admin
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full hover:text-black cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;