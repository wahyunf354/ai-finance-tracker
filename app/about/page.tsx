"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { AboutHeader } from "./_components/AboutHeader";
import { AboutInfo } from "./_components/AboutInfo";
import { SupportSection } from "./_components/SupportSection";
import { PremiumFeatures } from "./_components/PremiumFeatures";
import { FeedbackForm } from "./_components/FeedbackForm";

export default function AboutPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-2xl mx-auto space-y-6 pt-6 px-4 pb-24 overflow-y-auto custom-scrollbar">
      <AboutHeader />

      <AboutInfo />

      <SupportSection />

      <PremiumFeatures />

      {user && <FeedbackForm />}

      <div className="text-center text-xs text-muted-foreground pt-4">
        Made with ❤️ by Antigravity
      </div>
    </div>
  );
}
