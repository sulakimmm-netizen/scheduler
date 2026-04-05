export const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** Returns today's date as YYYY-MM-DD in KST */
export function getToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

/** Returns the day of week (0=Sun, 1=Mon, ..., 6=Sat) for a date string in KST */
export function getDayOfWeek(dateStr: string): number {
  const parts = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12)); // noon UTC to avoid date shift
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
  });
  const day = formatter.format(d);
  const map: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return map[day] ?? 0;
}

/** Returns Mon-Sun week range for a given date */
export function getWeekRange(dateStr: string): { start: string; end: string } {
  const parts = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  const dayOfWeek = d.getUTCDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + mondayOffset);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const fmt = (dt: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(dt);

  return { start: fmt(monday), end: fmt(sunday) };
}

/** Returns all dates in a week range as YYYY-MM-DD strings */
export function getWeekDates(startDate: string): string[] {
  const parts = startDate.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(d);
    day.setUTCDate(d.getUTCDate() + i);
    dates.push(
      new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(day)
    );
  }
  return dates;
}

/** Format time block hours to Korean string */
export function formatTimeBlock(hours: number | null): string | null {
  if (hours === null || hours === undefined) return null;
  if (hours < 1) return `${Math.round(hours * 60)}분`;
  return `${hours}시간`;
}

/** Format a date string to Korean display */
export function formatDateKo(dateStr: string): string {
  const parts = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(d);
}

/** Format short date for week view (e.g., "4/1") */
export function formatDateShort(dateStr: string): string {
  const parts = dateStr.split("-").map(Number);
  return `${parts[1]}/${parts[2]}`;
}

/** Navigate day: offset can be -1 (prev) or +1 (next) */
export function offsetDay(dateStr: string, offset: number): string {
  const parts = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  d.setUTCDate(d.getUTCDate() + offset);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(d);
}

/** Navigate week: offset can be -1 (prev) or +1 (next) */
export function offsetWeek(dateStr: string, offset: number): string {
  const parts = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  d.setUTCDate(d.getUTCDate() + offset * 7);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(d);
}
