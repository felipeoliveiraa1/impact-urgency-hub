-- Fix security warnings by setting search_path on functions

CREATE OR REPLACE FUNCTION public.normalize_score(score INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF score <= 3 THEN
    RETURN 1;
  ELSIF score <= 7 THEN
    RETURN 2;
  ELSE
    RETURN 3;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_priority(
  p_impacto_norm INTEGER,
  p_urgencia_norm INTEGER,
  p_complexidade_norm INTEGER,
  p_risco_norm INTEGER
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (p_impacto_norm * 0.4) + (p_urgencia_norm * 0.3) + 
         ((4 - p_complexidade_norm) * 0.2) + (p_risco_norm * 0.1);
END;
$$;

CREATE OR REPLACE FUNCTION public.determine_category(
  p_impacto_norm INTEGER,
  p_urgencia_norm INTEGER
)
RETURNS task_category
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_impacto_norm = 3 AND p_urgencia_norm = 3 THEN
    RETURN 'fazer_agora'::task_category;
  ELSIF p_impacto_norm = 3 AND p_urgencia_norm < 3 THEN
    RETURN 'agendar'::task_category;
  ELSIF p_impacto_norm < 3 AND p_urgencia_norm = 3 THEN
    RETURN 'delegar'::task_category;
  ELSE
    RETURN 'eliminar'::task_category;
  END IF;
END;
$$;

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
  NEW.linha := NEW.urgencia;
  NEW.coluna := NEW.impacto;
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;