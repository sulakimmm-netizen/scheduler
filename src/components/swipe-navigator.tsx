"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getToday, offsetDay } from "@/lib/utils";

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiped = useRef(false);
  const direction = useRef<"horizontal" | "vertical" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = getToday();
  const currentDate = searchParams.get("date") ?? today;

  const navigateDay = useCallback(
    (offset: number) => {
      const newDate = offsetDay(currentDate, offset);
      const params = new URLSearchParams(searchParams.toString());
      if (newDate === today) {
        params.delete("date");
      } else {
        params.set("date", newDate);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [currentDate, today, searchParams, pathname, router],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      swiped.current = false;
      direction.current = null;
    }

    function onTouchMove(e: TouchEvent) {
      if (swiped.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX.current;
      const dy = touch.clientY - touchStartY.current;

      // Lock direction after small movement
      if (direction.current === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        direction.current = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
      }

      // If horizontal, prevent vertical scroll
      if (direction.current === "horizontal") {
        e.preventDefault();

        if (Math.abs(dx) > 60) {
          swiped.current = true;
          navigateDay(dx < 0 ? 1 : -1);
        }
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [navigateDay]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  );
}
