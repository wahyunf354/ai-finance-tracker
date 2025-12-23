"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProcessingResponse } from "@/types";

interface VoiceRecorderProps {
  onProcessingStart: () => void;
  onProcessingComplete: (data: ProcessingResponse) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({
  onProcessingStart,
  onProcessingComplete,
  disabled,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Gagal mengakses mikrofon. Pastikan izin diberikan.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    onProcessingStart();

    const formData = new FormData();
    formData.append("audio", blob);

    try {
      const response = await fetch("/api/process-voice", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      onProcessingComplete(result);
    } catch (error) {
      console.error("Error sending audio:", error);
      alert("Gagal memproses audio.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="relative">
        {/* Animated Ripple Effect */}
        {isRecording && (
          <>
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-red-500/50"
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-red-500/30"
            />
          </>
        )}

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isProcessing}
          className={cn(
            "relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 shadow-xl",
            isRecording
              ? "bg-red-500 hover:bg-red-600 scale-110 ring-4 ring-red-500/30"
              : isProcessing
              ? "bg-slate-700 cursor-wait"
              : "bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          ) : isRecording ? (
            <Square className="h-10 w-10 text-white fill-current" />
          ) : (
            <Mic className="h-10 w-10 text-white" />
          )}
        </button>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">
          {isRecording
            ? "Merekam..."
            : isProcessing
            ? "Menganalisis Suara..."
            : "Tekan untuk Bicara"}
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          {isRecording
            ? "Katakan pengeluaranmu, contoh: 'Beli kopi 25 ribu'"
            : "AI akan mencatat otomatis ke Excel"}
        </p>
      </div>
    </div>
  );
}
