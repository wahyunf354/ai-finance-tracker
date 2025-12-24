import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { LanguageProvider } from "@/context/LanguageContext";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finflow - AI Finance Tracker",
  description: "Track your finances with AI powered by Google Gemini",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finflow",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b21a8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.className} h-screen bg-black text-white selection:bg-purple-500/30 overflow-hidden`}
      >
        <LanguageProvider>
          <div className="mx-auto max-w-md md:max-w-2xl h-screen relative flex flex-col overflow-hidden">
            <Header />
            <Navbar />
            <main className="flex-1 p-4 pt-24 pb-24 md:pb-4 md:pt-24 overflow-hidden">
              {children}
            </main>
          </div>
        </LanguageProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
