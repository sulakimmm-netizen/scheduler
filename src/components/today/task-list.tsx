"use client";

import { useState, useRef, useCallback } from "react";
import {
  toggleTaskCompletion,
  toggleRoutineCompletion,
  deleteTask,
  updateTask,
  reorderTasks,
} from "@/lib/actions";
import { useOptimisticToggle } from "@/hooks/use-optimistic-toggle";
import { TimeBlockBadge } from "@/components/ui/time-block-badge";
import type { DailyTask, DailyRoutine, RoutineCompletion } from "@/lib/types";

function TaskItem({
  task,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDragOver,
}: {
  task: DailyTask;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const { checked, toggle } = useOptimisticToggle(
    task.is_completed,
    async (current) => {
      await toggleTaskCompletion(task.id, current);
    }
  );

  async function handleSave() {
    if (title.trim() && title !== task.title) {
      const fd = new FormData();
      fd.set("title", title);
      if (task.time_block_hours !== null) {
        fd.set("time_block_hours", String(task.time_block_hours));
      }
      await updateTask(task.id, fd);
    }
    setEditing(false);
  }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isLongPress.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onDragStart();
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;

    // Cancel long press if moved
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }

    if (isLongPress.current) {
      // Reorder mode - handle drag over detection via parent
      return;
    }

    // Swipe detection (only left swipe)
    if (Math.abs(dx) > Math.abs(dy) && dx < -10) {
      setSwiping(true);
      setSwipeX(Math.max(dx, -100));
    }
  }

  function handleTouchEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (isLongPress.current) {
      isLongPress.current = false;
      onDragEnd();
      return;
    }

    if (swiping) {
      if (swipeX < -60) {
        // Keep delete button visible
        setSwipeX(-80);
      } else {
        setSwipeX(0);
      }
      setSwiping(false);
    }
  }

  async function handleDelete() {
    await deleteTask(task.id);
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg transition-shadow ${
        isDragging ? "opacity-50" : ""
      } ${isDragOver ? "ring-2 ring-pink-300" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Delete button behind */}
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={handleDelete}
          className="h-full px-6 bg-red-500 text-white text-sm font-medium"
        >
          삭제
        </button>
      </div>

      {/* Card content */}
      <div
        className="relative flex items-start gap-2.5 px-4 py-4 min-h-[44px] bg-gray-100 rounded-lg transition-transform"
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: swiping ? "none" : "transform 0.2s ease-out",
        }}
        onClick={() => {
          if (swipeX !== 0) {
            setSwipeX(0);
          }
        }}
      >
        {checked && (
          <div className="absolute inset-y-0 right-0 flex items-start z-10 rounded-r-lg overflow-hidden">
            <div
              className="h-full flex items-start pt-5 pr-5 pl-16"
              style={{
                background: "linear-gradient(to right, rgb(243 244 246 / 0.4), rgb(243 244 246) 50%)",
              }}
            >
              <span className="text-sm font-bold text-gray-900">완료</span>
            </div>
          </div>
        )}
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          className="w-6 h-6 rounded-full border-2 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer shrink-0 z-20"
        />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 -mt-px">
          <div className={checked ? "opacity-15" : ""}>
            {task.start_time && task.end_time ? (
              <span className="inline-flex items-center justify-center px-2 h-[24px] rounded-md text-xs font-medium bg-gray-900 text-white shrink-0 whitespace-nowrap">
                {task.start_time} ~ {task.end_time}
              </span>
            ) : (
              <TimeBlockBadge hours={task.time_block_hours} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setTitle(task.title);
                    setEditing(false);
                  }
                }}
                autoFocus
                className="w-full text-sm px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className={`text-sm text-left transition-colors ${
                  checked ? "text-black opacity-20" : "text-black"
                }`}
              >
                {task.title}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="relative flex items-start gap-2.5 px-4 py-4 min-h-[44px] bg-gray-100 rounded-lg">
        {checked && (
          <div className="absolute inset-y-0 right-0 flex items-start z-10 rounded-r-lg overflow-hidden">
            <div
              className="h-full flex items-start pt-5 pr-5 pl-16"
              style={{
                background: "linear-gradient(to right, rgb(243 244 246 / 0.4), rgb(243 244 246) 50%)",
              }}
            >
              <span className="text-sm font-bold text-gray-900">완료</span>
            </div>
          </div>
        )}
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          className="w-6 h-6 rounded-full border-2 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer shrink-0 z-20"
        />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 -mt-px">
          <div className={checked ? "opacity-15" : ""}>
            <TimeBlockBadge hours={routine.time_block_hours} />
          </div>
          <span
            className={`text-sm transition-colors ${
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

export function TaskList({
  tasks,
  routines = [],
  completions = [],
  date = "",
}: {
  tasks: DailyTask[];
  routines?: DailyRoutine[];
  completions?: RoutineCompletion[];
  date?: string;
}) {
  const [items, setItems] = useState(tasks);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync with server data
  const prevTasksRef = useRef(tasks);
  if (prevTasksRef.current !== tasks) {
    prevTasksRef.current = tasks;
    setItems(tasks);
  }

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (index: number) => {
      if (dragIndex === null || dragIndex === index) return;
      setDragOverIndex(index);

      // Reorder
      setItems((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(index, 0, moved);
        return next;
      });
      setDragIndex(index);
    },
    [dragIndex]
  );

  const handleDragEnd = useCallback(async () => {
    setDragIndex(null);
    setDragOverIndex(null);
    // Save new order
    const orderedIds = items.map((t) => t.id);
    await reorderTasks(orderedIds);
  }, [items]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-700">할 일</h2>
        <a
          href="/routines"
          className="text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors"
        >
          루틴 관리
        </a>
      </div>
      {routines.length === 0 && items.length === 0 ? (
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "calc(100vh - 350px)" }}
        >
          <p className="text-sm text-gray-400">할 일이 없습니다</p>
        </div>
      ) : (() => {
        const completionMap = new Map(
          completions.map((c) => [c.routine_id, c.is_completed])
        );

        // Build unified list: uncompleted routines, uncompleted tasks, completed routines, completed tasks
        const uncompleted: React.ReactNode[] = [];
        const completed: React.ReactNode[] = [];

        routines.forEach((routine) => {
          const isCompleted = completionMap.get(routine.id) ?? false;
          const node = (
            <RoutineItem
              key={`routine-${routine.id}`}
              routine={routine}
              date={date}
              isCompleted={isCompleted}
            />
          );
          if (isCompleted) completed.push(node);
          else uncompleted.push(node);
        });

        items.forEach((task, index) => {
          const node = (
            <TaskItem
              key={task.id}
              task={task}
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
              isDragging={dragIndex === index}
              isDragOver={dragOverIndex === index}
            />
          );
          if (task.is_completed) completed.push(node);
          else uncompleted.push(node);
        });

        return (
          <div className="flex flex-col gap-2">
            {uncompleted}
            {completed}
          </div>
        );
      })()}
    </section>
  );
}
