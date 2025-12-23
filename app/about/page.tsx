"use client";

import { AboutHeader } from "./_components/AboutHeader";
import { AboutInfo } from "./_components/AboutInfo";
import { SupportSection } from "./_components/SupportSection";
import { PremiumFeatures } from "./_components/PremiumFeatures";
import { FeedbackForm } from "./_components/FeedbackForm";

export default function AboutPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-2xl mx-auto space-y-6 pt-6 px-4 pb-24 overflow-y-auto custom-scrollbar">
      <AboutHeader />

      <AboutInfo />

      <SupportSection />

      <PremiumFeatures />

      <FeedbackForm />

      <div className="text-center text-xs text-muted-foreground pt-4">
        Made with ❤️ by Antigravity
      </div>
    </div>
  );
}
