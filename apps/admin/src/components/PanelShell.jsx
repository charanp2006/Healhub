"use client";
import { useContext } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import Login from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PanelShell = ({ children }) => {
  const { aToken } = useContext(AdminContext);

  if (!aToken) {
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