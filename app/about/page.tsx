"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Info,
  MessageSquarePlus,
  Send,
  Loader2,
  Star,
  Heart,
} from "lucide-react";
import { submitFeedback } from "@/app/server-actions/feedback";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    // Append rating manually since it's a state
    if (rating > 0) formData.append("rating", rating.toString());

    const result = await submitFeedback(formData);

    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
      setRating(0);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-2xl mx-auto space-y-6 pt-6 px-4 pb-24 overflow-y-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Info className="h-6 w-6" />
        About & Feedback
      </h1>

      {/* About Section */}
      <Card className="bg-card border shadow-sm">
        <CardHeader>
          <CardTitle>Finflow</CardTitle>
          <CardDescription>Version 1.0.0 (Beta)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Welcome to the future of personal finance tracking. This application
            utilizes advanced Artificial Intelligence (Google Gemini) to
            simplify how you record and analyze your daily transactions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <h3 className="font-semibold text-foreground mb-1">
                Voice & Text
              </h3>
              <p>
                Simply speak or type your expenses naturally. &quot;Bought
                coffee for 25k&quot; is all you need to say.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <h3 className="font-semibold text-foreground mb-1">
                Smart Categorization
              </h3>
              <p>
                The AI automatically understands context and categorizes your
                transactions instantly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 shadow-sm transition-all hover:scale-[1.01]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Heart className="h-5 w-5 fill-current" />
            Support Development
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enjoying Finflow? Your support helps me keep the AI running and
            develop new features.
          </p>
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
              Support via Saweria
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Premium Roadmap Section */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Star className="h-5 w-5 fill-current" />
            Upcoming Premium Features
          </CardTitle>
          <CardDescription>
            Elevate your financial management with our pro tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              </div>
              <div className="text-sm">
                <span className="font-bold">Unlimited Receipt Scanning:</span>{" "}
                Scan as many receipts as you want without daily limits.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              </div>
              <div className="text-sm">
                <span className="font-bold">Professional PDF Reports:</span> Get
                beautiful monthly summaries of your finances.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              </div>
              <div className="text-sm">
                <span className="font-bold">Pro Financial Insights:</span>{" "}
                Advanced AI analysis to help you save more.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="bg-card border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            Send Feedback
          </CardTitle>
          <CardDescription>
            We value your input! Tell us what you like or what we can improve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 animate-in fade-in zoom-in">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Thank You!</h3>
              <p className="text-muted-foreground">
                Your feedback has been sent successfully.
              </p>
              <Button
                variant="outline"
                onClick={() => setSuccess(false)}
                className="mt-4"
              >
                Send another
              </Button>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
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
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us your thoughts..."
                  required
                  className="min-h-[100px] resize-none bg-muted/50"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-4">
        Made with ❤️ by Antigravity
      </div>
    </div>
  );
}
