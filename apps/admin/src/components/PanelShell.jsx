"use client";
import { useContext, useEffect } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import { DoctorContext } from "@/src/context/DoctorContext";
import Login from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PanelShell = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  const {
    dToken,
    profileData: doctorProfile,
    getProfileData: fetchDoctorProfile,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken && !doctorProfile) {
      fetchDoctorProfile();
    }
  }, [dToken, doctorProfile, fetchDoctorProfile]);

  useEffect(() => {
    let title = "Healhub Panel";
    if (aToken) {
      title = "Admin Panel";
    } else if (dToken) {
      if (doctorProfile && doctorProfile.name) {
        title = `${doctorProfile.name} - Doctor`;
      } else {
        title = "Doctor Panel";
      }
    }
    document.title = title;
  }, [aToken, dToken, doctorProfile]);

  if (!aToken && !dToken) {
    return <Login />;
  }

  return (
    <div className="bg-background-light">
      <div className="">
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default PanelShell;
