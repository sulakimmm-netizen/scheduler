"use client";

import { useRef, useState } from "react";
import { createTask } from "@/lib/actions";
import { TimeSelect } from "@/components/ui/time-select";

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

type TimeMode = "block" | "range";

export function AddTaskForm({ date }: { date: string }) {
  const [open, setOpen] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>("block");
  const [selectedTime, setSelectedTime] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    formRef.current?.reset();
    setSelectedTime("");
    setCustomTime("");
    setStartTime("");
    setEndTime("");
  }

  async function handleSubmit(formData: FormData) {
    formData.set("date", date);
    if (timeMode === "block") {
      if (selectedTime === "custom" && customTime) {
        formData.set("time_block_hours", customTime);
      } else if (selectedTime && selectedTime !== "custom") {
        formData.set("time_block_hours", selectedTime);
      }
    }
    if (timeMode === "range" && startTime && endTime) {
      formData.set("start_time", startTime);
      formData.set("end_time", endTime);
    }
    await createTask(formData);
    resetForm();
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="w-full h-[48px] text-sm font-medium bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
          >
            + 할 일 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => {
          setOpen(false);
          resetForm();
        }}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-4">
          <form ref={formRef} action={handleSubmit} className="space-y-3">
            {/* 모드 토글 */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setTimeMode("block")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeMode === "block"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                소요 시간
              </button>
              <button
                type="button"
                onClick={() => setTimeMode("range")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeMode === "range"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                시간 지정
              </button>
            </div>

            {/* 시간 선택 영역 (고정 높이) */}
            <div className="h-[132px] flex items-center">
              {timeMode === "block" ? (
                <div className="flex gap-1.5 flex-wrap justify-center w-full">
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
                    <div className="w-full flex justify-center mt-1.5">
                      <div className="flex items-center gap-1">
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
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center w-full">
                  <TimeSelect
                    value={startTime}
                    onChange={setStartTime}
                    placeholder="시작"
                  />
                  <span className="text-gray-400 text-sm">~</span>
                  <TimeSelect
                    value={endTime}
                    onChange={setEndTime}
                    placeholder="종료"
                    scrollTo={startTime}
                  />
                </div>
              )}
            </div>

            {/* 제목 입력 */}
            <input
              ref={inputRef}
              name="title"
              type="text"
              placeholder="할 일을 입력하세요"
              required
              autoFocus
              className="w-full h-[48px] px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  resetForm();
                }
              }}
            />

            {/* 추가 버튼 */}
            <button
              type="submit"
              className="w-full h-[48px] text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              추가하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
