"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Auth 세션을 localStorage에 백업하는 컴포넌트.
 * iOS 홈화면 웹앱에서 쿠키가 날아가도 세션을 복구할 수 있도록 한다.
 */
export function AuthSync() {
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem("sb-refresh-token", session.refresh_token);
        localStorage.setItem("sb-access-token", session.access_token);
      }
      if (_event === "SIGNED_OUT") {
        localStorage.removeItem("sb-refresh-token");
        localStorage.removeItem("sb-access-token");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
