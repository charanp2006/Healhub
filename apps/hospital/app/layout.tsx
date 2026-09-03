import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/src/components/Providers";
import PanelShell from "@/src/components/PanelShell";

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
