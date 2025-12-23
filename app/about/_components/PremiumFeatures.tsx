import { Star, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export function PremiumFeatures() {
  const { t } = useLanguage();
  const [limits, setLimits] = useState({ image: 3, audio: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLimits() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase
          .from("app_configs")
          .select("key, value");

        if (data) {
          const imageLimit = data.find(
            (c) => c.key === "free_image_limit"
          )?.value;
          const voiceLimit = data.find(
            (c) => c.key === "free_voice_limit"
          )?.value;
          setLimits({
            image: imageLimit ? parseInt(imageLimit) : 3,
            audio: voiceLimit ? parseInt(voiceLimit) : 10,
          });
        }
      } catch (error) {
        console.error("Error fetching limits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLimits();
  }, []);

  const formatDescription = (text: string, limit: number) => {
    // Replace something like "3 scan/hari" or "3 scans/day" with the actual limit
    return text.replace(/\d+/, limit.toString());
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 shadow-sm relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <Star className="h-5 w-5 fill-current" />
          {t.about.premium_title}
        </CardTitle>
        <CardDescription>{t.about.premium_desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            </div>
            <div className="text-sm">
              <span className="font-bold">
                {t.about.premium_receipt_title}:
              </span>{" "}
              {formatDescription(t.about.premium_receipt, limits.image)}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            </div>
            <div className="text-sm">
              <span className="font-bold">{t.about.premium_voice_title}:</span>{" "}
              {formatDescription(t.about.premium_voice, limits.audio)}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            </div>
            <div className="text-sm">
              <span className="font-bold">{t.about.premium_pdf_title}:</span>{" "}
              {t.about.premium_pdf}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            </div>
            <div className="text-sm">
              <span className="font-bold">
                {t.about.premium_insights_title}:
              </span>{" "}
              {t.about.premium_insights}
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
