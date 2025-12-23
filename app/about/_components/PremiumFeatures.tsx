import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export function PremiumFeatures() {
  const { t } = useLanguage();
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 shadow-sm">
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
              {t.about.premium_receipt}
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            </div>
            <div className="text-sm">
              <span className="font-bold">{t.about.premium_voice_title}:</span>{" "}
              {t.about.premium_voice}
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
