import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AuthGate } from "@/components/auth-gate";
import { ViewTabs } from "@/components/view-tabs";
import { DateNavigator } from "@/components/date-navigator";
import { LogoutButton } from "@/components/logout-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSbCookies = cookieStore
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  if (!hasSbCookies) return <AuthGate />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <AuthGate />;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white">
        <div className="max-w-2xl mx-auto px-4 pt-3">
          <div className="mb-3 relative">
            <DateNavigator />
          </div>
        </div>
        <ViewTabs />
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
