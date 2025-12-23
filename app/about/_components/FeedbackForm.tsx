import { useState } from "react";
import { MessageSquarePlus, Send, Loader2, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/app/server-actions/feedback";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function FeedbackForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const handleSubmitAction = async (formData: FormData) => {
    setIsSubmitting(true);
    if (rating > 0) formData.append("rating", rating.toString());

    const result = await submitFeedback(formData);

    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
      setRating(0);
    }
  };

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5" />
          {t.about.feedback_title}
        </CardTitle>
        <CardDescription>{t.about.feedback_desc}</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 animate-in fade-in zoom-in">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">{t.about.success_thanks}</h3>
            <p className="text-muted-foreground">{t.about.success_msg}</p>
            <Button
              variant="outline"
              onClick={() => setSuccess(false)}
              className="mt-4"
            >
              {t.about.send_another}
            </Button>
          </div>
        ) : (
          <form action={handleSubmitAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.about.rating}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={cn(
                      "transition-all hover:scale-110",
                      rating >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        rating >= star && "fill-current"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                {t.about.message}
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder={t.about.message_placeholder}
                required
                className="min-h-[100px] resize-none bg-muted/50"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.about.sending}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t.about.submit}
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
