"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onClose,
  duration = 1000,
}: {
  message: string;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed left-0 right-0 bottom-[96px] z-[100] flex justify-center pointer-events-none">
      <div className="bg-gray-900/80 text-white text-sm font-medium px-6 py-3 rounded-full">
        {message}
      </div>
    </div>
  );
}
