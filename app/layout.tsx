import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Finance Tracker",
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
        className={`${inter.className} min-h-screen bg-black text-white selection:bg-purple-500/30`}
      >
        <div className="mx-auto max-w-md md:max-w-2xl min-h-screen relative pb-20 md:pb-0 md:pt-20">
          <Navbar />
          <main className="p-4 h-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
