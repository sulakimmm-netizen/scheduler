"use client";

import { useState, useRef, useEffect } from "react";

// Generate time slots from 07:00 to 24:00 in 30-min increments
const TIME_SLOTS: string[] = [];
for (let h = 7; h <= 24; h++) {
  const hh = String(h).padStart(2, "0");
  TIME_SLOTS.push(`${hh}:00`);
  if (h < 24) {
    TIME_SLOTS.push(`${hh}:30`);
  }
}

export function TimeSelect({
  value,
  onChange,
  placeholder = "시간",
  scrollTo,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  scrollTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      // Scroll to selected, or scrollTo hint, or 07:00 (first item)
      const scrollTarget = value || scrollTo;
      const idx = scrollTarget ? TIME_SLOTS.indexOf(scrollTarget) : 0;
      const target = idx >= 0 ? idx : 0;
      listRef.current.scrollTop = target * 40;
    }
  }, [open, value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`h-[44px] w-[90px] px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-left ${
          value ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {value || placeholder}
      </button>
      {open && (
        <div
          ref={listRef}
          className="absolute bottom-full mb-1 left-0 w-[90px] max-h-[200px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => {
                onChange(slot);
                setOpen(false);
              }}
              className={`w-full h-[40px] px-3 text-sm text-left hover:bg-gray-100 transition-colors ${
                value === slot ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-900"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
