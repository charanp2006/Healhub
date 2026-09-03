import type { Metadata, Viewport } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "@/src/context/AppContext";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import FloatingDemoButton from "@/src/components/FloatingDemoButton";
import ToastWrapper from "@/src/components/ToastWrapper";

export const metadata: Metadata = {
  title: "HealHub - Book Appointments Online",
  description: "Book doctors and hospital appointments online.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#20C3AE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppContextProvider>
          <div className="mx-4 sm:mx-[3%]">
            <ToastWrapper />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <FloatingDemoButton />
          </div>
        </AppContextProvider>
      </body>
    </html>
  );
}
