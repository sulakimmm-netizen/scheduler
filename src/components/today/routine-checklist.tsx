"use client";

import { toggleRoutineCompletion } from "@/lib/actions";
import { useOptimisticToggle } from "@/hooks/use-optimistic-toggle";
import { TimeBlockBadge } from "@/components/ui/time-block-badge";
import type { DailyRoutine, RoutineCompletion } from "@/lib/types";

function RoutineItem({
  routine,
  date,
  isCompleted,
}: {
  routine: DailyRoutine;
  date: string;
  isCompleted: boolean;
}) {
  const { checked, toggle } = useOptimisticToggle(isCompleted, async (current) => {
    await toggleRoutineCompletion(routine.id, date, current);
  });

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative flex items-start gap-2.5 px-5 py-5 min-h-[44px] bg-gray-100 rounded-lg">
        {checked && (
          <div className="absolute inset-y-0 right-0 flex items-start z-10 rounded-r-lg overflow-hidden">
            <div
              className="h-full flex items-start pt-5 pr-5 pl-16"
              style={{
                background: "linear-gradient(to right, rgb(243 244 246 / 0.4), rgb(243 244 246) 50%)",
              }}
            >
              <span className="text-base font-bold text-gray-900">완료</span>
            </div>
          </div>
        )}
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          className="w-6 h-6 rounded-full border-2 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer shrink-0 z-20"
        />
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className={checked ? "opacity-15" : ""}>
            <TimeBlockBadge hours={routine.time_block_hours} />
          </div>
          <span
            className={`text-base transition-colors ${
              checked ? "text-black opacity-20" : "text-black"
            }`}
          >
            {routine.title}
          </span>
        </div>
      </div>
    </div>
  );
}

export function RoutineChecklist({
  routines,
  completions,
  date,
}: {
  routines: DailyRoutine[];
  completions: RoutineCompletion[];
  date: string;
}) {
  if (routines.length === 0) return null;

  const completionMap = new Map(
    completions.map((c) => [c.routine_id, c.is_completed])
  );

  return (
    <section>
      <h2 className="text-sm font-medium text-gray-700 mb-4">매일 루틴</h2>
      <div className="flex flex-col gap-2">
        {routines.map((routine) => (
          <RoutineItem
            key={routine.id}
            routine={routine}
            date={date}
            isCompleted={completionMap.get(routine.id) ?? false}
          />
        ))}
      </div>
    </section>
  );
}
