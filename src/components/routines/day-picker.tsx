"use client";

import { DAYS_KO } from "@/lib/utils";

export function DayPicker({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (days: number[]) => void;
}) {
  function toggleDay(day: number) {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day].sort());
    }
  }

  // 월(1)~금(5), 토(6), 일(0) 순서로 표시
  const displayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="flex gap-1.5">
      {displayOrder.map((dayIndex) => {
        const isSelected = selected.includes(dayIndex);
        return (
          <button
            key={dayIndex}
            type="button"
            onClick={() => toggleDay(dayIndex)}
            className={`w-9 h-9 rounded-full text-xs font-medium transition-colors ${
              isSelected
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {DAYS_KO[dayIndex]}
          </button>
        );
      })}
    </div>
  );
}
