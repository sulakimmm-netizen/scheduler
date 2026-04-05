import { formatTimeBlock } from "@/lib/utils";

export function TimeBlockBadge({ hours }: { hours: number | null }) {
  const label = formatTimeBlock(hours);
  if (!label) return null;

  return (
    <span className="inline-flex items-center justify-center px-2 h-[24px] rounded-md text-xs font-medium bg-gray-900 text-white shrink-0 whitespace-nowrap">
      {label}
    </span>
  );
}
