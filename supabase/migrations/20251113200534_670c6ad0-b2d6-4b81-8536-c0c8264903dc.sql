-- Create enum for task categories
CREATE TYPE public.task_category AS ENUM ('fazer_agora', 'agendar', 'delegar', 'eliminar');

-- Create tarefas table
CREATE TABLE public.tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Raw criteria scores (1-10)
  impacto INTEGER NOT NULL CHECK (impacto BETWEEN 1 AND 10),
  urgencia INTEGER NOT NULL CHECK (urgencia BETWEEN 1 AND 10),
  complexidade INTEGER NOT NULL CHECK (complexidade BETWEEN 1 AND 10),
  risco INTEGER NOT NULL CHECK (risco BETWEEN 1 AND 10),
  
  -- Normalized scores (1-3)
  impacto_norm INTEGER,
  urgencia_norm INTEGER,
  complexidade_norm INTEGER,
  risco_norm INTEGER,
  
  -- Calculated fields
  prioridade NUMERIC,
  categoria task_category,
  linha INTEGER CHECK (linha BETWEEN 1 AND 10),
  coluna INTEGER CHECK (coluna BETWEEN 1 AND 10),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own tasks"
  ON public.tarefas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON public.tarefas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tarefas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tarefas FOR DELETE
  USING (auth.uid() = user_id);

-- Function to normalize scores from 1-10 to 1-3
CREATE OR REPLACE FUNCTION public.normalize_score(score INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
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

-- Function to calculate priority
CREATE OR REPLACE FUNCTION public.calculate_priority(
  p_impacto_norm INTEGER,
  p_urgencia_norm INTEGER,
  p_complexidade_norm INTEGER,
  p_risco_norm INTEGER
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN (p_impacto_norm * 0.4) + (p_urgencia_norm * 0.3) + 
         ((4 - p_complexidade_norm) * 0.2) + (p_risco_norm * 0.1);
END;
$$;

-- Function to determine category based on normalized scores
CREATE OR REPLACE FUNCTION public.determine_category(
  p_impacto_norm INTEGER,
  p_urgencia_norm INTEGER
)
RETURNS task_category
LANGUAGE plpgsql
IMMUTABLE
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

-- Trigger function to calculate all metrics
CREATE OR REPLACE FUNCTION public.calculate_task_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Normalize scores
  NEW.impacto_norm := public.normalize_score(NEW.impacto);
  NEW.urgencia_norm := public.normalize_score(NEW.urgencia);
  NEW.complexidade_norm := public.normalize_score(NEW.complexidade);
  NEW.risco_norm := public.normalize_score(NEW.risco);
  
  -- Calculate priority
  NEW.prioridade := public.calculate_priority(
    NEW.impacto_norm,
    NEW.urgencia_norm,
    NEW.complexidade_norm,
    NEW.risco_norm
  );
  
  -- Determine category
  NEW.categoria := public.determine_category(NEW.impacto_norm, NEW.urgencia_norm);
  
  -- Calculate matrix position (linha = urgência, coluna = impacto)
  NEW.linha := NEW.urgencia;
  NEW.coluna := NEW.impacto;
  
  -- Update timestamp
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER trigger_calculate_task_metrics
  BEFORE INSERT OR UPDATE ON public.tarefas
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_task_metrics();