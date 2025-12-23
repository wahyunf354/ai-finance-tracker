import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export function AboutInfo() {
  const { t } = useLanguage();
  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader>
        <CardTitle>{t.header.title}</CardTitle>
        <CardDescription>{t.about.version}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>{t.about.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <h3 className="font-semibold text-foreground mb-1">
              {t.about.voice_text_title}
            </h3>
            <p>{t.about.voice_text_desc}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <h3 className="font-semibold text-foreground mb-1">
              {t.about.smart_cat_title}
            </h3>
            <p>{t.about.smart_cat_desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
