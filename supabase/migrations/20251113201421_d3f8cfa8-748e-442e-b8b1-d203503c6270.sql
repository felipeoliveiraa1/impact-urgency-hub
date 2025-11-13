-- Update tarefas table for 12x12 grid
ALTER TABLE public.tarefas DROP CONSTRAINT IF EXISTS tarefas_linha_check;
ALTER TABLE public.tarefas DROP CONSTRAINT IF EXISTS tarefas_coluna_check;

ALTER TABLE public.tarefas ADD CONSTRAINT tarefas_linha_check CHECK (linha BETWEEN 1 AND 12);
ALTER TABLE public.tarefas ADD CONSTRAINT tarefas_coluna_check CHECK (coluna BETWEEN 1 AND 12);

-- Function to map 1-10 score to 1-12 position
CREATE OR REPLACE FUNCTION public.calcular_posicao_matriz(pontuacao INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN CASE
    WHEN pontuacao = 1 THEN 1
    WHEN pontuacao = 2 THEN 2
    WHEN pontuacao = 3 THEN 3
    WHEN pontuacao = 4 THEN 5
    WHEN pontuacao = 5 THEN 6
    WHEN pontuacao = 6 THEN 7
    WHEN pontuacao = 7 THEN 8
    WHEN pontuacao = 8 THEN 10
    WHEN pontuacao = 9 THEN 11
    WHEN pontuacao = 10 THEN 12
    ELSE 1
  END;
END;
$$;

-- Update trigger to use new mapping function
CREATE OR REPLACE FUNCTION public.calculate_task_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.impacto_norm := public.normalize_score(NEW.impacto);
  NEW.urgencia_norm := public.normalize_score(NEW.urgencia);
  NEW.complexidade_norm := public.normalize_score(NEW.complexidade);
  NEW.risco_norm := public.normalize_score(NEW.risco);
  
  NEW.prioridade := public.calculate_priority(
    NEW.impacto_norm,
    NEW.urgencia_norm,
    NEW.complexidade_norm,
    NEW.risco_norm
  );
  
  NEW.categoria := public.determine_category(NEW.impacto_norm, NEW.urgencia_norm);
  
  -- Use new mapping for 12x12 grid
  NEW.linha := public.calcular_posicao_matriz(NEW.urgencia);
  NEW.coluna := public.calcular_posicao_matriz(NEW.impacto);
  
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;