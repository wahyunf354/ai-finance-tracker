"use client";

import Link from "next/link";
import { Info, LogOut, Wallet } from "lucide-react";
import { logout } from "@/app/server-actions/auth";

export default function Header() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-lg border-b border-white/10 md:hidden">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-lg tracking-tight">Finflow</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/about"
          className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition-all active:scale-95"
          title="About"
        >
          <Info className="h-5 w-5" />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all active:scale-95"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
