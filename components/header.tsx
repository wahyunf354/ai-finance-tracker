"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Wallet,
  Crown,
  User,
  LogOut,
  Info,
  Languages,
  Moon,
  Sun,
  Laptop,
  Settings,
} from "lucide-react";
import { logout } from "@/app/server-actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setUser(null);
    await logout();
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-lg border-b border-border md:hidden">
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

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-12 w-72 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-black/5"
            >
              {/* User Profile Section */}
              <div className="p-4 bg-muted/30 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name ? (
                        user.name.substring(0, 2).toUpperCase()
                      ) : (
                        <User size={16} />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate leading-none mb-1">
                      {user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "Sign in to sync"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-1">
                {/* Theme Selection */}
                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Theme
                  </p>
                  <div className="grid grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg">
                    {[
                      { value: "light", icon: Sun },
                      { value: "dark", icon: Moon },
                      { value: "system", icon: Laptop },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setTheme(item.value)}
                        className={cn(
                          "flex items-center justify-center py-1.5 rounded-md transition-all",
                          theme === item.value
                            ? "bg-background text-primary shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span>Language</span>
                  </div>
                  <span className="text-xs font-bold uppercase bg-muted px-1.5 py-0.5 rounded border border-border group-hover:border-primary/20">
                    {language}
                  </span>
                </button>

                <div className="h-px bg-border mx-2 my-1" />

                {/* About Link */}
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Info className="h-4 w-4" />
                  <span>{t.about.title}</span>
                </Link>

                <div className="h-px bg-border mx-2 my-1" />

                {/* Settings Link */}
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t.settings.title}</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
