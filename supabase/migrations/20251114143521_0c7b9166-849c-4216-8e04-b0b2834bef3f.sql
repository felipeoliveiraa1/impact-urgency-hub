-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS calculate_task_metrics_trigger ON public.tarefas;
DROP FUNCTION IF EXISTS public.calculate_task_metrics();

-- Create new trigger function with position calculation based on provided logic
CREATE OR REPLACE FUNCTION public.calculate_task_position()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Normalize scores (1-10 to 1-3)
  NEW.impacto_norm := public.normalize_score(NEW.impacto);
  NEW.urgencia_norm := public.normalize_score(NEW.urgencia);
  NEW.complexidade_norm := public.normalize_score(NEW.complexidade);
  NEW.risco_norm := public.normalize_score(NEW.risco);
  
  -- Calculate priority using weighted formula: (impact * 2) + (urgency * 2) + complexity + risk
  NEW.prioridade := (NEW.impacto_norm * 2) + (NEW.urgencia_norm * 2) + NEW.complexidade_norm + NEW.risco_norm;
  
  -- Determine category based on priority
  NEW.categoria := CASE
    WHEN NEW.prioridade >= 12 THEN 'fazer_agora'
    WHEN NEW.prioridade >= 9 THEN 'agendar'
    WHEN NEW.prioridade >= 6 THEN 'delegar'
    ELSE 'eliminar'
  END;
  
  -- Calculate matrix position (1-11) based on original scores (1-10)
  -- LINHA (Y-axis based on IMPACTO) - INVERTED: high impact = top (linha 1), low impact = bottom (linha 11)
  -- Formula: 11 - ROUND((impacto - 1) * (10.0 / 9.0))
  NEW.linha := 11 - ROUND((NEW.impacto - 1) * (10.0 / 9.0))::integer;
  
  -- COLUNA (X-axis based on URGENCIA) - NORMAL: low urgency = left (coluna 1), high urgency = right (coluna 11)
  -- Formula: ROUND((urgencia - 1) * (10.0 / 9.0)) + 1
  NEW.coluna := (ROUND((NEW.urgencia - 1) * (10.0 / 9.0)) + 1)::integer;
  
  -- Ensure values are within bounds (1-11)
  NEW.linha := GREATEST(1, LEAST(11, NEW.linha));
  NEW.coluna := GREATEST(1, LEAST(11, NEW.coluna));
  
  -- Update timestamp
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER calculate_task_position_trigger
BEFORE INSERT OR UPDATE ON public.tarefas
FOR EACH ROW
EXECUTE FUNCTION public.calculate_task_position();