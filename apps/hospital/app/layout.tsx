import type { Metadata, Viewport } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/src/components/Providers";
import PanelShell from "@/src/components/PanelShell";
import RegisterSW from "@/src/components/RegisterSW";

export const metadata: Metadata = {
  title: "Healhub Clinic - Management Portal",
  description: "Clinic and doctor management, appointments and analytics for Healhub",
  manifest: "/manifest.json",
  icons: {
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5f6FFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <PanelShell>{children}</PanelShell>
        </Providers>
        <RegisterSW />
      </body>
    </html>
  );
}