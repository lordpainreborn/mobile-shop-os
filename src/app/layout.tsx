import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthShell from "@/components/AuthShell";
import FloatingSupportWidget from "@/components/FloatingSupportWidget";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIOMS POS",
  description: "PC & Cloud POS Operating System for mobile shops",
  icons: {
    icon: "/favicon.svg",
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
        <LanguageProvider>
          <AuthShell>{children}</AuthShell>
          <FloatingSupportWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}