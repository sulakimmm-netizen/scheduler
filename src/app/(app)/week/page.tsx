import { createClient } from "@/lib/supabase/server";
import { getRoutines, getTasksForWeek, getCompletionsForWeek } from "@/lib/queries";
import { WeekCalendar } from "@/components/week/week-calendar";
import { getToday, getWeekRange } from "@/lib/utils";

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const params = await searchParams;
  const today = getToday();
  const weekRange = getWeekRange(params.start ?? today);
  const query = params.q?.toLowerCase() ?? "";

  const [routines, tasks, completions] = await Promise.all([
    getRoutines(user.id),
    getTasksForWeek(user.id, weekRange.start, weekRange.end),
    getCompletionsForWeek(user.id, weekRange.start, weekRange.end),
  ]);

  const filteredRoutines = query
    ? routines.filter((r) => r.title.toLowerCase().includes(query))
    : routines;
  const filteredTasks = query
    ? tasks.filter((t) => t.title.toLowerCase().includes(query))
    : tasks;

  return (
    <WeekCalendar
      weekStart={weekRange.start}
      routines={filteredRoutines}
      tasks={filteredTasks}
      completions={completions}
    />
  );
}
