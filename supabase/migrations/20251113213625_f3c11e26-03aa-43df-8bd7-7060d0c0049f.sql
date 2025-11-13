-- Atualizar a função calcular_posicao_matriz para mapear para matriz 11x11
CREATE OR REPLACE FUNCTION public.calcular_posicao_matriz(pontuacao integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN CASE
    WHEN pontuacao = 1 THEN 1
    WHEN pontuacao = 2 THEN 2
    WHEN pontuacao = 3 THEN 3
    WHEN pontuacao = 4 THEN 4
    WHEN pontuacao = 5 THEN 5
    WHEN pontuacao = 6 THEN 6
    WHEN pontuacao = 7 THEN 8
    WHEN pontuacao = 8 THEN 9
    WHEN pontuacao = 9 THEN 10
    WHEN pontuacao = 10 THEN 11
    ELSE 1
  END;
END;
$function$;