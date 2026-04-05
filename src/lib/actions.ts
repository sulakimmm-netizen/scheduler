"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// === Auth Helpers ===

async function getAuthUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

// === Routine Actions ===

export async function createRoutine(formData: FormData) {
  const userId = await getAuthUserId();
  const title = formData.get("title") as string;
  const daysStr = formData.get("days_of_week") as string;
  const days = daysStr ? JSON.parse(daysStr) as number[] : [];
  const timeBlockStr = formData.get("time_block_hours") as string;
  const timeBlockHours = timeBlockStr ? parseFloat(timeBlockStr) : null;

  if (!title?.trim()) return;

  const supabase = await createClient();
  await supabase.from("daily_routines").insert({
    user_id: userId,
    title: title.trim(),
    days_of_week: days,
    time_block_hours: timeBlockHours,
  });

  revalidatePath("/");
  revalidatePath("/routines");
  revalidatePath("/week");
}

export async function updateRoutine(id: string, formData: FormData) {
  const userId = await getAuthUserId();
  const title = formData.get("title") as string;
  const daysStr = formData.get("days_of_week") as string;
  const days = daysStr ? JSON.parse(daysStr) as number[] : [];
  const timeBlockStr = formData.get("time_block_hours") as string;
  const timeBlockHours = timeBlockStr ? parseFloat(timeBlockStr) : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("daily_routines")
    .update({ title: title.trim(), days_of_week: days, time_block_hours: timeBlockHours })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("updateRoutine error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/routines");
  revalidatePath("/week");
}

export async function deleteRoutine(id: string) {
  const userId = await getAuthUserId();
  const supabase = await createClient();
  await supabase
    .from("daily_routines")
    .update({ is_active: false })
    .eq("id", id)
    .eq("user_id", userId);

  revalidatePath("/");
  revalidatePath("/routines");
  revalidatePath("/week");
}

// === Task Actions ===

export async function createTask(formData: FormData) {
  const userId = await getAuthUserId();
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const timeBlockStr = formData.get("time_block_hours") as string;
  const timeBlockHours = timeBlockStr ? parseFloat(timeBlockStr) : null;
  const startTime = (formData.get("start_time") as string) || null;
  const endTime = (formData.get("end_time") as string) || null;

  if (!title?.trim() || !date) return;

  const supabase = await createClient();
  await supabase.from("daily_tasks").insert({
    user_id: userId,
    title: title.trim(),
    date,
    time_block_hours: timeBlockHours,
    start_time: startTime,
    end_time: endTime,
  });

  revalidatePath("/");
  revalidatePath("/week");
}

export async function updateTask(id: string, formData: FormData) {
  const userId = await getAuthUserId();
  const title = formData.get("title") as string;
  const timeBlockStr = formData.get("time_block_hours") as string;
  const timeBlockHours = timeBlockStr ? parseFloat(timeBlockStr) : null;

  const supabase = await createClient();
  await supabase
    .from("daily_tasks")
    .update({
      title: title.trim(),
      time_block_hours: timeBlockHours,
    })
    .eq("id", id)
    .eq("user_id", userId);

  revalidatePath("/");
  revalidatePath("/week");
}

export async function deleteTask(id: string) {
  const userId = await getAuthUserId();
  const supabase = await createClient();
  await supabase
    .from("daily_tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  revalidatePath("/");
  revalidatePath("/week");
}

export async function reorderTasks(orderedIds: string[]) {
  const userId = await getAuthUserId();
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("daily_tasks")
      .update({ order: index })
      .eq("id", id)
      .eq("user_id", userId)
  );
  await Promise.all(updates);

  revalidatePath("/");
  revalidatePath("/week");
}

// === Completion Actions ===

export async function toggleRoutineCompletion(
  routineId: string,
  date: string,
  currentState: boolean
) {
  const userId = await getAuthUserId();
  const supabase = await createClient();

  if (currentState) {
    // Uncheck: delete the completion record
    await supabase
      .from("routine_completions")
      .delete()
      .eq("routine_id", routineId)
      .eq("date", date)
      .eq("user_id", userId);
  } else {
    // Check: upsert a completion record
    await supabase.from("routine_completions").upsert(
      {
        routine_id: routineId,
        user_id: userId,
        date,
        is_completed: true,
      },
      { onConflict: "routine_id,date" }
    );
  }

  revalidatePath("/");
  revalidatePath("/week");
}

export async function toggleTaskCompletion(
  taskId: string,
  currentState: boolean
) {
  const userId = await getAuthUserId();
  const supabase = await createClient();

  await supabase
    .from("daily_tasks")
    .update({ is_completed: !currentState })
    .eq("id", taskId)
    .eq("user_id", userId);

  revalidatePath("/");
  revalidatePath("/week");
}
