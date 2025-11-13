-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can view tasks" ON public.tarefas;
DROP POLICY IF EXISTS "Anyone can create tasks" ON public.tarefas;
DROP POLICY IF EXISTS "Anyone can update tasks" ON public.tarefas;
DROP POLICY IF EXISTS "Anyone can delete tasks" ON public.tarefas;

-- Create new public RLS policies (allow anon and authenticated)
CREATE POLICY "Anyone can view tasks" 
ON public.tarefas 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Anyone can create tasks" 
ON public.tarefas 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update tasks" 
ON public.tarefas 
FOR UPDATE 
TO public
USING (true);

CREATE POLICY "Anyone can delete tasks" 
ON public.tarefas 
FOR DELETE 
TO public
USING (true);