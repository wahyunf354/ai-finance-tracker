import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { LanguageProvider } from "@/context/LanguageContext";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finflow",
  description: "Track your finances with AI",
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
            <main className="flex-1 p-4 pt-20 pb-24 md:pb-4 md:pt-24 overflow-hidden">
              {children}
            </main>
          </div>
        </LanguageProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
