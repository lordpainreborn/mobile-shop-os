import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthShell from "@/components/AuthShell";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import PlatformSwitcher from "@/components/PlatformSwitcher";
import DesktopSplashScreen from "@/components/DesktopSplashScreen";
import { LanguageProvider } from "@/context/LanguageContext";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIOMS POS — All In One Mobile Shop System",
  description: "Next-Gen PC & Cloud POS Platform for Mobile Shops",
  icons: {
    icon: "/AIOMSLOGO.png",
    shortcut: "/AIOMSLOGO.png",
    apple: "/AIOMSLOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-800`}>
        <DesktopSplashScreen />
        <SmoothScroll>
          <LanguageProvider>
            <AuthShell>{children}</AuthShell>
            <FloatingSupportWidget />
            <PlatformSwitcher />
          </LanguageProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
