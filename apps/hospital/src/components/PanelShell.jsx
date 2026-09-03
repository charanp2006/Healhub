"use client";

import { useContext } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Login from "./Login";

const PanelShell = ({ children }) => {
  const { hToken } = useContext(HospitalContext);

  if (!hToken) {
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
