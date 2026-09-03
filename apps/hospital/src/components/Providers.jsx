"use client";

import HospitalContextProvider from "@/src/context/HospitalContext";
import AdminContextProvider from "@/src/context/AdminContext";
import DoctorContextProvider from "@/src/context/DoctorContext";
import AppContextProvider from "@/src/context/AppContext";
import ToastWrapper from "./ToastWrapper";

const Providers = ({ children }) => {
  return (
    <HospitalContextProvider>
      <AdminContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            {children}
            <ToastWrapper />
          </AppContextProvider>
        </DoctorContextProvider>
      </AdminContextProvider>
    </HospitalContextProvider>
  );
};

export default Providers;
