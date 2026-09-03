"use client";
import AdminContextProvider from "@/src/context/AdminContext";
import DoctorContextProvider from "@/src/context/DoctorContext";
import HospitalContextProvider from "@/src/context/HospitalContext";
import AppContextProvider from "@/src/context/AppContext";
import ToastWrapper from "./ToastWrapper";

const Providers = ({ children }) => {
  return (
    <AdminContextProvider>
      <DoctorContextProvider>
        <HospitalContextProvider>
          <AppContextProvider>
            <ToastWrapper />
            {children}
          </AppContextProvider>
        </HospitalContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  );
};

export default Providers;
