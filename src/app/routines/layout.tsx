import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AuthGate } from "@/components/auth-gate";
import { SearchBar } from "@/components/search-bar";

export default async function RoutinesLayout({
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
          <div className="flex items-center justify-center relative mb-3 h-[44px]">
            <a
              href="/"
              className="absolute left-0 p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="뒤로가기"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 4L7 10L13 16" />
              </svg>
            </a>
            <h1 className="text-lg font-bold text-gray-900">루틴 관리</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <SearchBar />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 pt-2 pb-24">{children}</main>
    </div>
  );
}
