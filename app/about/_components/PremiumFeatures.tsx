import { Star, Loader2, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { getAppConfig } from "@/app/server-actions/config";

export function PremiumFeatures() {
  const { t } = useLanguage();
  const [limits, setLimits] = useState({ image: 3, audio: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLimits() {
      try {
        const result = await getAppConfig();
        if (result.success && result.config) {
          setLimits({
            image: result.config.free_image_limit
              ? parseInt(result.config.free_image_limit)
              : 3,
            audio: result.config.free_voice_limit
              ? parseInt(result.config.free_voice_limit)
              : 10,
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

  const formatDescription = (text: string | undefined, limit?: number) => {
    if (!text) return "";
    if (limit === undefined) return text;
    return text.replace(/\d+/, limit.toString());
  };

  const featureList = [
    {
      id: "receipt",
      title: t.about?.premium_receipt_title || "Unlimited Receipt Scanning",
      desc: formatDescription(t.about?.premium_receipt, limits.image),
    },
    {
      id: "voice",
      title: t.about?.premium_voice_title || "Unlimited Voice Input",
      desc: formatDescription(t.about?.premium_voice, limits.audio),
    },
    {
      id: "pdf",
      title: t.about?.premium_pdf_title || "Professional PDF Reports",
      desc: t.about?.premium_pdf || "Download monthly summaries",
    },
    {
      id: "insights",
      title: t.about?.premium_insights_title || "Pro Financial Insights",
      desc: t.about?.premium_insights || "Advanced AI analysis",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-500/15 to-blue-500/15 border-purple-500/30 shadow-md relative">
      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
          <Star className="h-6 w-6 fill-current text-yellow-500" />
          {t.about?.premium_title || "Finflow Premium"}
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          {t.about?.premium_desc ||
            "Tingkatkan pengelolaan keuangan Anda dengan fitur Pro."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <ul className="grid grid-cols-1 gap-4">
          {featureList.map((feature) => (
            <li
              key={feature.id}
              className="flex items-start gap-4 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="h-5 w-5 text-purple-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground leading-tight">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
