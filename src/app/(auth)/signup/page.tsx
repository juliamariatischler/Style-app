"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/wardrobe`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--background)]">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--success)] flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Fast geschafft!</h2>
          <p className="text-[var(--muted)] text-sm">
            Wir haben dir eine Bestätigungs-E-Mail an{" "}
            <span className="text-[var(--foreground)] font-medium">{email}</span> gesendet.
            Klicke den Link, um dein Konto zu aktivieren.
          </p>
          <Button
            className="mt-8 w-full"
            size="lg"
            variant="outline"
            onClick={() => router.push("/login")}
          >
            Zum Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--foreground)] flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StyleAI</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Starte deinen Kleiderschrank</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Dein Name"
              className="w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
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
              minLength={8}
              placeholder="Min. 8 Zeichen"
              className="w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)] bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Konto erstellen
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Bereits registriert?{" "}
          <Link
            href="/login"
            className="text-[var(--accent-dark)] font-medium hover:underline"
          >
            Einloggen
          </Link>
        </p>
      </div>
    </div>
  );
}
