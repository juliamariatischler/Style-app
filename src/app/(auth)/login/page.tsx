"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/wardrobe");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--foreground)] flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StyleAI</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Willkommen zurück</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="deine@email.com"
              className="w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)] bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Einloggen
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Noch kein Konto?{" "}
          <Link
            href="/signup"
            className="text-[var(--accent-dark)] font-medium hover:underline"
          >
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
