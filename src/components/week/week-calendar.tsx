"use client";

import { useRouter } from "next/navigation";
import { DayColumn } from "./day-column";
import { getWeekDates, getDayOfWeek, getToday, offsetWeek } from "@/lib/utils";
import type { DailyRoutine, DailyTask, RoutineCompletion } from "@/lib/types";

export function WeekCalendar({
  weekStart,
  routines,
  tasks,
  completions,
}: {
  weekStart: string;
  routines: DailyRoutine[];
  tasks: DailyTask[];
  completions: RoutineCompletion[];
}) {
  const router = useRouter();
  const today = getToday();
  const dates = getWeekDates(weekStart);

  const tasksByDate = new Map<string, DailyTask[]>();
  tasks.forEach((t) => {
    const list = tasksByDate.get(t.date) ?? [];
    list.push(t);
    tasksByDate.set(t.date, list);
  });

  const completionsByDate = new Map<string, RoutineCompletion[]>();
  completions.forEach((c) => {
    const list = completionsByDate.get(c.date) ?? [];
    list.push(c);
    completionsByDate.set(c.date, list);
  });

  function navigateWeek(offset: number) {
    const newStart = offsetWeek(weekStart, offset);
    router.push(`/week?start=${newStart}`);
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => navigateWeek(-1)}
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="이전 주"
        >
          ←
        </button>
        <h2 className="text-sm font-medium text-gray-700">
          {weekStart.slice(5).replace("-", "/")} — {dates[6]?.slice(5).replace("-", "/")}
        </h2>
        <button
          onClick={() => navigateWeek(1)}
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="다음 주"
        >
          →
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {dates.map((dateStr) => {
          const dow = getDayOfWeek(dateStr);
          return (
            <DayColumn
              key={dateStr}
              dateStr={dateStr}
              dayOfWeek={dow}
              isToday={dateStr === today}
              routines={routines}
              tasks={tasksByDate.get(dateStr) ?? []}
              completions={completionsByDate.get(dateStr) ?? []}
            />
          );
        })}
      </div>
    </div>
  );
}
