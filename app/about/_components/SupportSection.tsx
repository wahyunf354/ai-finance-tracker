import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function SupportSection() {
  const { t } = useLanguage();
  return (
    <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 shadow-sm transition-all hover:scale-[1.01]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <Heart className="h-5 w-5 fill-current" />
          {t.about.support_title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t.about.support_desc}</p>
        <Button
          asChild
          className="w-full bg-[#fa6400] hover:bg-[#fa6400]/90 text-white font-bold border-none"
        >
          <a
            href="https://saweria.co/finflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            {t.about.support_button}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
