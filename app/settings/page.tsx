"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Calendar, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [day, setDay] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.billing_cycle_start_day) {
          setDay(data.user.billing_cycle_start_day);
        }
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, []);

  const handleSave = async () => {
    if (day < 1 || day > 31) {
      toast.error(t.settings?.day_error || "Invalid day");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing_cycle_start_day: day }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(t.settings.success);
      router.refresh();
    } catch (_error) {
      console.error(_error);
      toast.error(t.settings.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-6 pt-6 px-4 pb-24 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t.settings.title}</h1>
      </div>

      <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{t.settings.dialog_title}</CardTitle>
          <CardDescription>Manage your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fetching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-base">{t.settings.cycle_label}</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 max-w-[200px]">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={day}
                      onChange={(e) => setDay(parseInt(e.target.value) || 1)}
                      className="font-mono text-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.settings.cycle_hint}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full md:w-auto md:min-w-[120px]"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.settings.save}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
