"use client";

import { useState } from "react";
import { createRoutine, updateRoutine } from "@/lib/actions";
import { DayPicker } from "./day-picker";
import type { DailyRoutine } from "@/lib/types";

const TIME_OPTIONS = [
  { label: "없음", value: "" },
  { label: "30분", value: "0.5" },
  { label: "1시간", value: "1" },
  { label: "1.5시간", value: "1.5" },
  { label: "2시간", value: "2" },
  { label: "3시간", value: "3" },
  { label: "4시간", value: "4" },
  { label: "직접입력", value: "custom" },
];

export function RoutineForm({
  routine,
  onClose,
}: {
  routine?: DailyRoutine;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(routine?.title ?? "");
  const [days, setDays] = useState<number[]>(routine?.days_of_week ?? [1, 2, 3, 4, 5]);
  const isCustomInitial =
    routine?.time_block_hours != null &&
    !["0.5", "1", "1.5", "2", "3", "4"].includes(String(routine.time_block_hours));
  const [selectedTime, setSelectedTime] = useState(
    isCustomInitial ? "custom" : (routine?.time_block_hours != null ? String(routine.time_block_hours) : "")
  );
  const [customTime, setCustomTime] = useState(
    isCustomInitial ? String(routine.time_block_hours) : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("days_of_week", JSON.stringify(days));
    if (selectedTime === "custom" && customTime) {
      fd.set("time_block_hours", customTime);
    } else if (selectedTime && selectedTime !== "custom") {
      fd.set("time_block_hours", selectedTime);
    }

    if (routine) {
      await updateRoutine(routine.id, fd);
    } else {
      await createRoutine(fd);
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* 요일 선택 (먼저) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          반복 요일
        </label>
        <DayPicker selected={days} onChange={setDays} />
      </div>

      {/* 소요 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          소요 시간
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedTime(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTime === opt.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          {selectedTime === "custom" && (
            <div className="flex items-center gap-1 mt-1.5">
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="0.0"
                className="w-[60px] h-[36px] px-2 text-sm text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">시간</span>
            </div>
          )}
        </div>
      </div>

      {/* 루틴 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          루틴 이름
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 출근중 10분 책 읽기"
          required
          autoFocus
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-[48px] text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 h-[48px] text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {routine ? "수정하기" : "추가하기"}
        </button>
      </div>
    </form>
  );
}
