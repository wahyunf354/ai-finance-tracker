"use client";

import Link from "next/link";
import {
  MessageSquare,
  LayoutDashboard,
  History,
  LogOut,
  Info,
  Languages,
  Calculator,
} from "lucide-react";
import { logout } from "@/app/server-actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/80 p-4 backdrop-blur-lg md:top-0 md:bottom-auto md:justify-center md:gap-8 md:border-b md:border-t-0">
      <Link
        href="/"
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t.nav.chat}</span>
      </Link>

      <Link
        href="/dashboard"
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200"
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t.nav.dashboard}</span>
      </Link>

      <Link
        href="/budget"
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200"
      >
        <Calculator className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t.nav.budget}</span>
      </Link>

      <Link
        href="/transactions"
        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200"
      >
        <History className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t.nav.history}</span>
      </Link>

      <Link
        href="/about"
        className="hidden md:flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200"
      >
        <Info className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t.about.title}</span>
      </Link>

      <button
        onClick={toggleLanguage}
        className="hidden md:flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-all active:scale-110"
        title="Switch Language"
      >
        <Languages className="h-5 w-5" />
        <span className="text-[10px] font-bold uppercase">{language}</span>
      </button>

      <div className="hidden md:flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-all active:scale-105">
        <ModeToggle
          className="border-none p-0 h-5 w-5 hover:bg-transparent text-muted-foreground/80 hover:text-primary"
          align="center"
        />
        <span className="text-[10px] font-medium">THEME</span>
      </div>

      <button
        onClick={handleLogout}
        className="hidden md:flex flex-col items-center gap-1 text-muted-foreground hover:text-destructive transition-colors hover:scale-110 active:scale-95 duration-200"
      >
        <LogOut className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t.nav.logout}</span>
      </button>
    </nav>
  );
}
