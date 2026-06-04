import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleAI — KI-Outfit-Stylist",
  description:
    "Lade deine Kleidung hoch und lass die KI vollständige Outfits aus deinem eigenen Kleiderschrank zusammenstellen.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
