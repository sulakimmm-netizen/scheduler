-- Add start_time and end_time columns for specific time range scheduling
ALTER TABLE daily_tasks ADD COLUMN start_time TEXT;  -- "HH:MM" format
ALTER TABLE daily_tasks ADD COLUMN end_time TEXT;    -- "HH:MM" format
