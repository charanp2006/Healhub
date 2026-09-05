"use client";

import HospitalContextProvider from "@/src/context/HospitalContext";
import AdminContextProvider from "@/src/context/AdminContext";
import DoctorContextProvider from "@/src/context/DoctorContext";
import AppContextProvider from "@/src/context/AppContext";
import { ThemeProvider } from "@healhub/ui/theme";
import ToastWrapper from "./ToastWrapper";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default Providers;
