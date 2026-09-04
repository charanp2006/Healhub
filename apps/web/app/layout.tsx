import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "@/src/context/AppContext";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import FloatingDemoButton from "@/src/components/FloatingDemoButton";
import MobileAppHeader from "@/src/components/MobileAppHeader";
import MobileTabBar from "@/src/components/MobileTabBar";
import ToastWrapper from "@/src/components/ToastWrapper";
import RegisterSW from "@/src/components/RegisterSW";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "HealHub - Book Appointments Online",
  description: "Book doctors and hospital appointments online.",
  manifest: "/manifest.json",
  icons: {
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5f6FFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <AppContextProvider>
          <div className="mx-0 sm:mx-[3%] bg-[#f6f8fa] md:bg-white min-h-screen">
            <ToastWrapper />
            <MobileAppHeader />
            <div className="hidden md:block">
              <Navbar />
            </div>
            <main className="min-h-screen px-4 md:px-0 pb-[96px] md:pb-0">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
            <FloatingDemoButton />
            <MobileTabBar />
          </div>
          <RegisterSW />
        </AppContextProvider>
      </body>
    </html>
  );
}
