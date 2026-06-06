import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/toast";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");
  } catch {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
