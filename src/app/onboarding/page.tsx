"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Shirt, ShoppingBag } from "lucide-react";

const SLIDES = [
  {
    icon: Shirt,
    title: "Dein Kleiderschrank.\nKI-gestylt.",
    description:
      "Lade deine Kleidungsstücke hoch und lass StyleAI sie automatisch kategorisieren und analysieren.",
    bg: "bg-[var(--panel)]",
    accent: "text-[var(--accent-dark)]",
  },
  {
    icon: Sparkles,
    title: "Wähle deinen\nPersönlichen Stil.",
    description:
      "Old Money, Clean Girl, Dark Academia, Streetwear — wähle aus 10 Styles und bekomme perfekt abgestimmte Outfits.",
    bg: "bg-[var(--accent-light)]",
    accent: "text-[var(--accent-dark)]",
  },
  {
    icon: ShoppingBag,
    title: "Fehlt etwas?\nWir finden es.",
    description:
      "Wenn ein Teil für deinen Wunsch-Look fehlt, sucht StyleAI automatisch nach den besten Produkten online.",
    bg: "bg-[var(--panel-strong)]",
    accent: "text-[var(--foreground)]",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === SLIDES.length - 1;

  function nextSlide() {
    if (isLast) {
      router.push("/signup");
    } else {
      setCurrentSlide((s) => s + 1);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${slide.bg} transition-colors duration-500`}>
      {/* Skip */}
      <div className="flex justify-end p-5">
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Überspringen
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-[var(--foreground)] flex items-center justify-center mb-10 shadow-xl">
          <Icon size={44} className="text-[var(--accent)]" />
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold tracking-tight text-center whitespace-pre-line leading-tight mb-4">
          {slide.title}
        </h2>
        <p className="text-center text-[var(--muted)] text-base leading-relaxed max-w-xs">
          {slide.description}
        </p>
      </div>

      {/* Navigation */}
      <div className="px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-8 h-2 bg-[var(--foreground)]"
                  : "w-2 h-2 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={nextSlide}>
          {isLast ? "Starte deinen Kleiderschrank" : "Weiter"}
        </Button>

        {currentSlide === 0 && (
          <p className="text-center text-sm text-[var(--muted)]">
            Bereits ein Konto?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-[var(--accent-dark)] font-medium"
            >
              Einloggen
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
