-- Remove the trigger that automatically calculates task metrics
DROP TRIGGER IF EXISTS trigger_calculate_task_metrics ON tarefas;