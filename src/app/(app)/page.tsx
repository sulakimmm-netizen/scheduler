import { createClient } from "@/lib/supabase/server";
import { getRoutinesForDay, getTasksForDate, getCompletionsForDate } from "@/lib/queries";
import { TaskList } from "@/components/today/task-list";
import { AddTaskForm } from "@/components/today/add-task-form";
import { getToday, getDayOfWeek } from "@/lib/utils";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { date: dateParam } = await searchParams;
  const date = dateParam ?? getToday();
  const dayOfWeek = getDayOfWeek(date);

  const [routines, tasks, completions] = await Promise.all([
    getRoutinesForDay(user.id, dayOfWeek),
    getTasksForDate(user.id, date),
    getCompletionsForDate(user.id, date),
  ]);

  return (
    <div>
      <TaskList tasks={tasks} routines={routines} completions={completions} date={date} />
      <AddTaskForm date={date} />
    </div>
  );
}
