"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatDateKo, formatDateShort, getToday, offsetDay } from "@/lib/utils";

export function DateNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = getToday();
  const currentDate = searchParams.get("date") ?? today;

  function navigateDay(offset: number) {
    const newDate = offsetDay(currentDate, offset);
    const params = new URLSearchParams(searchParams.toString());
    if (newDate === today) {
      params.delete("date");
    } else {
      params.set("date", newDate);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center justify-center w-[220px]">
        <button
          onClick={() => navigateDay(-1)}
          className="p-1 text-gray-400 hover:text-gray-900 transition-colors min-h-[44px] flex items-center justify-center"
          aria-label="이전 날"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M12 4 L6 10 L12 16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900 mx-1 whitespace-nowrap">
          {formatDateKo(currentDate)}
        </h1>
        <button
          onClick={() => navigateDay(1)}
          className="p-1 text-gray-400 hover:text-gray-900 transition-colors min-h-[44px] flex items-center justify-center"
          aria-label="다음 날"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M8 4 L14 10 L8 16" />
          </svg>
        </button>
      </div>
      {currentDate !== today && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("date");
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname);
          }}
          className="text-xs text-gray-400 font-medium ml-1 absolute right-4"
        >
          오늘날짜로
        </button>
      )}
    </div>
  );
}
