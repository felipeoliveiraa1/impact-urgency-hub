-- Recalculate positions for all existing tasks by triggering the new trigger
UPDATE public.tarefas 
SET updated_at = now()
WHERE id IS NOT NULL;