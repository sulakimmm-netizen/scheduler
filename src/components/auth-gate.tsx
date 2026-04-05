"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthGate() {
  const [restoring, setRestoring] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("saved-email");
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }

    async function tryRestore() {
      const supabase = createClient();
      const refreshToken = localStorage.getItem("sb-refresh-token");
      if (refreshToken) {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        if (data.session) {
          localStorage.setItem("sb-refresh-token", data.session.refresh_token);
          localStorage.setItem("sb-access-token", data.session.access_token);
          router.refresh();
          return;
        }
        if (error) {
          localStorage.removeItem("sb-refresh-token");
          localStorage.removeItem("sb-access-token");
        }
      }
      setRestoring(false);
    }

    tryRestore();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (rememberEmail) {
      localStorage.setItem("saved-email", email);
    } else {
      localStorage.removeItem("saved-email");
    }

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSignupSuccess(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    if (data.session) {
      localStorage.setItem("sb-refresh-token", data.session.refresh_token);
      localStorage.setItem("sb-access-token", data.session.access_token);
    }

    router.refresh();
  }

  if (restoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Daily Planner</h1>
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">가입 완료</h1>
          <p className="text-sm text-gray-600 mb-6">
            이메일을 확인해주세요. 인증 링크를 클릭하면 로그인할 수 있습니다.
          </p>
          <button
            onClick={() => {
              setSignupSuccess(false);
              setMode("login");
            }}
            className="text-sm text-gray-900 underline"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Daily Planner</h1>
          <p className="text-sm text-gray-500 mt-1">매일의 할 일을 체계적으로</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {mode === "login" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-600">이메일 주소 기억하기</span>
            </label>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading
              ? mode === "login"
                ? "로그인 중..."
                : "가입 중..."
              : mode === "login"
                ? "로그인"
                : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className="text-gray-900 underline"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-gray-900 underline"
              >
                로그인
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
