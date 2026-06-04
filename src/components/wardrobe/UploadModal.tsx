"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { WardrobeItem } from "@/types";

interface UploadModalProps {
  onClose: () => void;
}

interface PreviewFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export function UploadModal({ onClose }: UploadModalProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const addWardrobeItem = useAppStore((s) => s.addWardrobeItem);
  const { showToast } = useToast();

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function processFiles() {
    if (files.length === 0) return;
    setIsProcessing(true);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);

        const res = await fetch("/api/classify", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { item }: { item: WardrobeItem } = await res.json();
        addWardrobeItem(item);

        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f))
        );
      } catch {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: "Fehler beim Upload" } : f
          )
        );
      }
    }

    setIsProcessing(false);
    const doneCount = files.filter((f) => f.status !== "error").length;
    if (doneCount > 0) {
      showToast(
        `${doneCount} Kleidungsstück${doneCount !== 1 ? "e" : ""} hinzugefügt!`,
        "success"
      );
      onClose();
    }
  }

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-[var(--background)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold">Kleidung hinzufügen</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-[var(--panel)] text-[var(--muted)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-[var(--accent)] bg-[var(--accent-light)]"
                : "border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--panel)]"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--panel-strong)] flex items-center justify-center">
                <ImagePlus size={24} className="text-[var(--muted)]" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isDragActive ? "Loslassen zum Hochladen" : "Fotos hierher ziehen"}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  oder klicken zum Auswählen · JPG, PNG, WebP · max. 10 MB
                </p>
              </div>
            </div>
          </div>

          {/* Preview grid */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--panel)]">
                  <img
                    src={f.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* Status overlay */}
                  {f.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                  {f.status === "done" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/40">
                      <span className="text-white text-xl">✓</span>
                    </div>
                  )}
                  {f.status === "error" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/40">
                      <span className="text-white text-xl">✗</span>
                    </div>
                  )}
                  {f.status === "pending" && !isProcessing && (
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border)]">
          <Button
            size="lg"
            className="w-full"
            onClick={processFiles}
            disabled={pendingCount === 0 || isProcessing}
            loading={isProcessing}
          >
            <Upload size={16} />
            {isProcessing
              ? "KI analysiert..."
              : `${pendingCount} Bild${pendingCount !== 1 ? "er" : ""} hochladen`}
          </Button>
        </div>
      </div>
    </div>
  );
}
