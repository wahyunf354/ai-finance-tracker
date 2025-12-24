"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsDialogProps {
  currentStartDay?: number;
  triggerClass?: string;
  onUpdate?: () => void;
}

export function SettingsDialog({
  currentStartDay = 1,
  triggerClass,
  onUpdate,
}: SettingsDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState(currentStartDay);
  const router = useRouter();

  // Sync prop changes to state when dialog opens or prop updates
  useEffect(() => {
    setDay(currentStartDay);
  }, [currentStartDay]);

  const handleSave = async () => {
    if (day < 1 || day > 31) {
      toast.error(t.settings.day_error);
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
      setOpen(false);
      if (onUpdate) onUpdate();
      router.refresh();
    } catch (error) {
      toast.error(t.settings.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={triggerClass}>
          <Settings className="h-4 w-4" />
          <span>{t.settings.title}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.settings.dialog_title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t.settings.cycle_label}</Label>
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value) || 1)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t.settings.cycle_hint}
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.settings.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
