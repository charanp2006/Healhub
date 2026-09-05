"use client";
import { useContext } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import Login from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileAppBar from "./MobileAppBar";
import MobileTabBar from "./MobileTabBar";

const PanelShell = ({ children }) => {
  const { aToken } = useContext(AdminContext);

  if (!aToken) {
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