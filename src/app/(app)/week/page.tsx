import { createClient } from "@/lib/supabase/server";
import { getRoutines, getTasksForWeek, getCompletionsForWeek } from "@/lib/queries";
import { WeekCalendar } from "@/components/week/week-calendar";
import { getToday, getWeekRange } from "@/lib/utils";

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const params = await searchParams;
  const today = getToday();
  const weekRange = getWeekRange(params.start ?? today);

  const [routines, tasks, completions] = await Promise.all([
    getRoutines(user.id),
    getTasksForWeek(user.id, weekRange.start, weekRange.end),
    getCompletionsForWeek(user.id, weekRange.start, weekRange.end),
  ]);

  return (
    <WeekCalendar
      weekStart={weekRange.start}
      routines={routines}
      tasks={tasks}
      completions={completions}
    />
  );
}
