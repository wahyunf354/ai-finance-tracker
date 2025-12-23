"use client";

import Link from "next/link";
import { Info, LogOut, Wallet, Languages, Crown } from "lucide-react";
import { logout } from "@/app/server-actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-lg border-b border-white/10 md:hidden">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="font-bold text-lg tracking-tight">
            {t.header.title}
          </span>
          {user?.is_premium && (
            <div className="flex items-center gap-1">
              <Crown className="h-2.5 w-2.5 text-yellow-500 fill-current" />
              <span className="text-[8px] font-bold text-yellow-500 uppercase tracking-widest">
                PREMIUM
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition-all active:scale-95 border border-white/5"
          title="Switch Language"
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>
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
