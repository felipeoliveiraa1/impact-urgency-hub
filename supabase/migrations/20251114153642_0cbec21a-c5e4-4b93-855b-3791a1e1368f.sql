-- Fix calculate_task_metrics to use calcular_posicao_matriz function
CREATE OR REPLACE FUNCTION public.calculate_task_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Normalize scores (1-10 to 1-3)
  NEW.impacto_norm := public.normalize_score(NEW.impacto);
  NEW.urgencia_norm := public.normalize_score(NEW.urgencia);
  NEW.complexidade_norm := public.normalize_score(NEW.complexidade);
  NEW.risco_norm := public.normalize_score(NEW.risco);
  
  -- Calculate priority using weighted formula
  NEW.prioridade := (NEW.impacto_norm * 2) + (NEW.urgencia_norm * 2) + NEW.complexidade_norm + NEW.risco_norm;
  
  -- Determine category based on priority
  NEW.categoria := CASE
    WHEN NEW.prioridade >= 12 THEN 'fazer_agora'
    WHEN NEW.prioridade >= 9 THEN 'agendar'
    WHEN NEW.prioridade >= 6 THEN 'delegar'
    ELSE 'eliminar'
  END;
  
  -- Calculate matrix position (1-11, skipping 6) using the mapping function
  -- linha is based on urgencia (vertical axis)
  -- coluna is based on impacto (horizontal axis)
  NEW.linha := public.calcular_posicao_matriz(NEW.urgencia);
  NEW.coluna := public.calcular_posicao_matriz(NEW.impacto);
  
  -- Update timestamp
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;

-- Update constraints to reflect valid range (1-11, excluding 6)
ALTER TABLE public.tarefas 
  DROP CONSTRAINT IF EXISTS tarefas_linha_check;
  
ALTER TABLE public.tarefas 
  DROP CONSTRAINT IF EXISTS tarefas_coluna_check;

ALTER TABLE public.tarefas
  ADD CONSTRAINT tarefas_linha_check CHECK (linha >= 1 AND linha <= 11 AND linha != 6);

ALTER TABLE public.tarefas
  ADD CONSTRAINT tarefas_coluna_check CHECK (coluna >= 1 AND coluna <= 11 AND coluna != 6);

-- Recalculate all existing tasks to apply the corrected mapping
UPDATE public.tarefas 
SET updated_at = now()
WHERE id IS NOT NULL;