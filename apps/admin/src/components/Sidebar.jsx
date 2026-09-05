"use client";
import { useContext } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assets } from "@/src/assets/assets";
import { BarChart3, DollarSign, Building2 } from "lucide-react";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="min-h-screen bg-background-card border-r border-border">
      {aToken && (
        <ul className="text-text-secondary mt-5">
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/admin-dashboard") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/admin-dashboard"
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/all-appointments") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/all-appointments"
          >
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/add-doctor") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/add-doctor"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/add-hospital") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/add-hospital"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Hospital</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/hospitals-list") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/hospitals-list"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block">Hospitals List</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/hospitals-mgmt") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/hospitals-mgmt"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block">Hospital Management</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/manage-rooms") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/manage-rooms"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block">Manage Rooms</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-list") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-list"
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/add-blog") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/add-blog"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Blog</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/blogs-list") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/blogs-list"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block">Blog Posts</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/analytics") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/analytics"
          >
            <BarChart3 size={20} />
            <p className="hidden md:block">Analytics</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/hospital-analytics") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/hospital-analytics"
          >
            <Building2 size={20} />
            <p className="hidden md:block">Hospital Analytics</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/billing") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/billing"
          >
            <DollarSign size={20} />
            <p className="hidden md:block">Billing</p>
          </Link>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;