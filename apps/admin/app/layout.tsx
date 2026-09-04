import type { Metadata, Viewport } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import PanelShell from "@/src/components/PanelShell";
import Providers from "@/src/components/Providers";
import RegisterSW from "@/src/components/RegisterSW";

export const metadata: Metadata = {
  title: "Healhub Admin Panel",
  description: "Admin Control Panel",
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