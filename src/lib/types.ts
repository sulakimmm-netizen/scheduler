export interface DailyRoutine {
  id: string;
  user_id: string;
  title: string;
  days_of_week: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  time_block_hours: number | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time_block_hours: number | null;
  start_time: string | null; // "HH:MM"
  end_time: string | null;   // "HH:MM"
  is_completed: boolean;
  order: number;
  created_at: string;
}

export interface RoutineCompletion {
  id: string;
  routine_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  is_completed: boolean;
  is_skipped: boolean;
  updated_at: string;
}
