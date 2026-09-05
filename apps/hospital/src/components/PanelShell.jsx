"use client";

import { useContext, useEffect } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";
import { DoctorContext } from "@/src/context/DoctorContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Login from "./Login";
import MobileAppBar from "./MobileAppBar";
import MobileTabBar from "./MobileTabBar";

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
    <div className="bg-background-base min-h-screen">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <MobileAppBar />
      <div className="flex items-start">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 min-h-screen pb-[96px] md:pb-0">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
};

export default PanelShell;