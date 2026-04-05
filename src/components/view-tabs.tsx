"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ViewTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: "오늘", href: "/" },
    { label: "이번 주", href: "/week" },
  ];

  return (
    <nav className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors -mb-px ${
              isActive
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
