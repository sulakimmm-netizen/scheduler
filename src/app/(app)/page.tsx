import { createClient } from "@/lib/supabase/server";
import { getRoutinesForDay, getTasksForDate, getCompletionsForDate } from "@/lib/queries";
import { TaskList } from "@/components/today/task-list";
import { AddTaskForm } from "@/components/today/add-task-form";
import { getToday, getDayOfWeek } from "@/lib/utils";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { date: dateParam, q } = await searchParams;
  const date = dateParam ?? getToday();
  const dayOfWeek = getDayOfWeek(date);
  const query = q?.toLowerCase() ?? "";

  const [routines, tasks, completions] = await Promise.all([
    getRoutinesForDay(user.id, dayOfWeek),
    getTasksForDate(user.id, date),
    getCompletionsForDate(user.id, date),
  ]);

  const filteredRoutines = query
    ? routines.filter((r) => r.title.toLowerCase().includes(query))
    : routines;
  const filteredTasks = query
    ? tasks.filter((t) => t.title.toLowerCase().includes(query))
    : tasks;

  return (
    <div>
      <TaskList tasks={filteredTasks} routines={filteredRoutines} completions={completions} date={date} />
      <AddTaskForm date={date} />
    </div>
  );
}
