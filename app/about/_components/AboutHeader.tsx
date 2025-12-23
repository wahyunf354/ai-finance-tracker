import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AboutHeader() {
  const { t } = useLanguage();
  return (
    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Info className="h-6 w-6" />
      {t.about.title}
    </h1>
  );
}
