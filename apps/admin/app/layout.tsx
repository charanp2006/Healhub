import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import PanelShell from "@/src/components/PanelShell";
import Providers from "@/src/components/Providers";

export const metadata: Metadata = {
  title: "Healhub Panel",
  description: "Admin & Doctor Control Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <PanelShell>{children}</PanelShell>
        </Providers>
      </body>
    </html>
  );
}
