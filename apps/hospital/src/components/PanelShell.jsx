"use client";

import { useContext, useEffect } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";
import { DoctorContext } from "@/src/context/DoctorContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Login from "./Login";

const PanelShell = ({ children }) => {
  const { hToken } = useContext(HospitalContext);
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
    let title = "Healhub Clinic";
    if (hToken) {
      title = "Clinic Panel";
    } else if (dToken) {
      title =
        doctorProfile && doctorProfile.name
          ? `${doctorProfile.name} - Doctor`
          : "Doctor Panel";
    }
    document.title = title;
  }, [dToken, hToken, doctorProfile]);

  if (!hToken && !dToken) {
    return <Login />;
  }

  return (
    <div className="bg-background-light">
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default PanelShell;