"use client";
import { useContext } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assets } from "@/src/assets/assets";
import { DoctorContext } from "@/src/context/DoctorContext";
import { BarChart3, DollarSign, Building2, Calendar, FileText } from "lucide-react";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="min-h-screen bg-background-cardLight border-r border-border-light">
      {aToken && (
        <ul className="text-text-secondaryLight mt-5 ">
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/admin-dashboard") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/admin-dashboard"
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block ">Dashboard</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/all-appointments") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/all-appointments"
          >
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block ">Appointments</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/add-doctor") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/add-doctor"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block ">Add Doctor</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/add-hospital") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/add-hospital"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block ">Add Hospital</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/hospitals-list") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/hospitals-list"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block ">Hospitals List</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/hospitals-mgmt") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/hospitals-mgmt"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block ">Hospital Management</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/manage-rooms") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/manage-rooms"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block ">Manage Rooms</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-list") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-list"
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block ">Doctors List</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/add-blog") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/add-blog"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block ">Add Blog</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/blogs-list") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/blogs-list"
          >
            <img src={assets.list_icon} alt="" />
            <p className="hidden md:block ">Blog Posts</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/analytics") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/analytics"
          >
            <BarChart3 size={20} />
            <p className="hidden md:block ">Analytics</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/hospital-analytics") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/hospital-analytics"
          >
            <Building2 size={20} />
            <p className="hidden md:block ">Hospital Analytics</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/billing") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/billing"
          >
            <DollarSign size={20} />
            <p className="hidden md:block ">Billing</p>
          </Link>
        </ul>
      )}

      {dToken && (
        <ul className="text-text-secondaryLight mt-5 ">
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-dashboard") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-dashboard"
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-appointments") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-appointments"
          >
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block ">Appointments</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-availability") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-availability"
          >
            <Calendar size={20} />
            <p className="hidden md:block ">Availability</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-analytics") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-analytics"
          >
            <BarChart3 size={20} />
            <p className="hidden md:block ">Analytics</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-blogs") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-blogs"
          >
            <FileText size={20} />
            <p className="hidden md:block ">Blog Posts</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-add-blog") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-add-blog"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block ">Add Blog</p>
          </Link>
          <Link
            className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive("/doctor-profile") ? "bg-primary-soft border-r-4 border-primary" : ""}`}
            href="/doctor-profile"
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block ">Profile</p>
          </Link>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
