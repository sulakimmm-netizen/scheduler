"use client";

import { useState } from "react";
import { TaskFormModal } from "./task-form-modal";
import { RoutineList } from "@/components/routines/routine-list";
import { RoutineForm } from "@/components/routines/routine-form";
import type { DailyRoutine } from "@/lib/types";

export function AddTaskForm({
  date,
  allRoutines = [],
}: {
  date: string;
  allRoutines?: DailyRoutine[];
}) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [routineModalOpen, setRoutineModalOpen] = useState(false);
  const [addingRoutine, setAddingRoutine] = useState(false);

  return (
    <>
      {/* 하단 버튼 바 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white z-30">
        <div className="max-w-2xl mx-auto flex gap-2">
          <button
            onClick={() => setRoutineModalOpen(true)}
            className="w-[112px] h-[48px] text-sm font-medium bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            루틴 관리
          </button>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="flex-1 h-[48px] text-sm font-medium bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
          >
            할 일 추가
          </button>
        </div>
      </div>

      {/* 할일 추가 모달 */}
      {taskModalOpen && (
        <TaskFormModal date={date} onClose={() => setTaskModalOpen(false)} />
      )}

      {/* 루틴 관리 모달 */}
      {routineModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setRoutineModalOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg"
            style={{ height: "640px" }}
          >
            <div className="max-w-2xl mx-auto h-full flex flex-col">
              <div className="flex items-center px-4 pt-4 pb-2 shrink-0">
                <h2 className="text-base font-semibold">루틴 관리</h2>
              </div>
              <div className="flex-1 overflow-y-auto px-4">
                <RoutineList routines={allRoutines} inModal />
              </div>
              <div className="shrink-0 p-4 bg-white">
                <div className="flex gap-2">
                  <button
                    onClick={() => setRoutineModalOpen(false)}
                    className="w-[112px] h-[48px] text-sm font-medium bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                  >
                    닫기
                  </button>
                  <button
                    onClick={() => setAddingRoutine(true)}
                    className="flex-1 h-[48px] text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    루틴 추가하기
                  </button>
                </div>
              </div>
            </div>
            {addingRoutine && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-[60]"
                  onClick={() => setAddingRoutine(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl shadow-lg">
                  <div className="max-w-2xl mx-auto px-4 pt-4 pb-4">
                    <RoutineForm onClose={() => setAddingRoutine(false)} />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
