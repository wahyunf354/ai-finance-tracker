"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Square, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "audio";
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I am your AI Finance Assistant. You can tell me about your expenses or income via text or voice.",
      timestamp: new Date(),
    },
  ]);
  const [inputObj, setInputObj] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice_note.webm", {
          type: "audio/webm",
        });
        handleSubmit(undefined, file);
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleSubmit = async (e?: React.FormEvent, audioFile?: File) => {
    e?.preventDefault();

    if (!inputObj && !audioFile) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: audioFile ? "🎤 Voice Note" : inputObj,
      type: audioFile ? "audio" : "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputObj("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (audioFile) {
        formData.append("file", audioFile);
      } else {
        formData.append("text", newMessage.content);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Add transcribed text if it was audio
      if (audioFile && data.transcribedText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id
              ? { ...m, content: `🎤 "${data.transcribedText}"` }
              : m
          )
        );
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Got it! I've saved a ${data.data.type} of ${data.data.amount} for ${data.data.description} (${data.data.category}).`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, something went wrong: ${errorMessage}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-2xl mx-auto">
      <Card className="flex-1 flex flex-col border-none bg-transparent shadow-none">
        {/* Chat Area */}
        <ScrollArea className="flex-1 px-2 pr-4">
          <div className="flex flex-col gap-4 py-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex w-full gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarFallback
                      className={cn(
                        "text-xs font-bold",
                        message.role === "assistant"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {message.role === "assistant" ? <Bot size={16} /> : "ME"}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-muted-foreground rounded-tl-sm"
                    )}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <div
                      className={cn(
                        "text-[10px] opacity-50 mt-1",
                        message.role === "user"
                          ? "text-primary-foreground/70 text-right"
                          : "text-muted-foreground/70"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full gap-3"
              >
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Processing...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="pt-4 pb-2">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="relative flex items-end gap-2 bg-secondary/30 p-2 rounded-3xl border border-white/5 backdrop-blur-sm"
          >
            <Input
              value={inputObj}
              onChange={(e) => setInputObj(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Type a message..."}
              disabled={isRecording || isLoading}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 h-auto text-base placeholder:text-muted-foreground/50 shadow-none min-h-[48px]"
            />

            <div className="flex items-center gap-1 pr-1 pb-1">
              {inputObj.trim() ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="icon"
                  className="rounded-full h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "secondary"}
                  size="icon"
                  className={cn(
                    "rounded-full h-10 w-10 shrink-0 transition-all duration-200",
                    isRecording && "animate-pulse"
                  )}
                >
                  {isRecording ? (
                    <Square className="h-4 w-4 fill-current" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
