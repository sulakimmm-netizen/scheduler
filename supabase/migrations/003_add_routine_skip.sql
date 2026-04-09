-- 개별 날짜에서 루틴 건너뛰기 지원
ALTER TABLE routine_completions ADD COLUMN is_skipped BOOLEAN NOT NULL DEFAULT false;
