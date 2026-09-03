"use client";

import React from "react";
import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assets } from "@/src/assets/assets";
import { HospitalContext } from "@/src/context/HospitalContext";
import { BarChart3, DollarSign, FileText, BedDouble } from "lucide-react";

const Sidebar = () => {
  const { hToken } = useContext(HospitalContext);
  const pathname = usePathname();

  const active = (to) =>
    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${
      pathname === to ? "bg-primary-soft border-r-4 border-primary" : ""
    }`;

  return (
    <div className="min-h-screen bg-background-cardLight border-r border-border-light">
      {hToken && (
        <ul className="text-text-secondaryLight mt-5 ">
          <Link href="/hospital-dashboard" className={active("/hospital-dashboard")}>
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </Link>
          <Link href="/hospital-add-doctor" className={active("/hospital-add-doctor")}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </Link>
          <Link href="/hospital-doctors" className={active("/hospital-doctors")}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </Link>
          <Link href="/hospital-manage-rooms" className={active("/hospital-manage-rooms")}>
            <BedDouble size={20} />
            <p className="hidden md:block">Rooms &amp; Beds</p>
          </Link>
          <Link href="/hospital-blogs" className={active("/hospital-blogs")}>
            <FileText size={20} />
            <p className="hidden md:block">Blog Posts</p>
          </Link>
          <Link href="/hospital-billings" className={active("/hospital-billings")}>
            <DollarSign size={20} />
            <p className="hidden md:block">Billings</p>
          </Link>
          <Link href="/hospital-panel-analytics" className={active("/hospital-panel-analytics")}>
            <BarChart3 size={20} />
            <p className="hidden md:block">Analytics</p>
          </Link>
          <Link href="/hospital-profile" className={active("/hospital-profile")}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block ">Profile</p>
          </Link>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
