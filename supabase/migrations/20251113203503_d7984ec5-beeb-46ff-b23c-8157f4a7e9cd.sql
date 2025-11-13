-- Remove existing RLS policies
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tarefas;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tarefas;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tarefas;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tarefas;

-- Remove user_id column
ALTER TABLE public.tarefas DROP COLUMN user_id;

-- Create new public RLS policies (allow all authenticated users)
CREATE POLICY "Anyone can view tasks" 
ON public.tarefas 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Anyone can create tasks" 
ON public.tarefas 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update tasks" 
ON public.tarefas 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Anyone can delete tasks" 
ON public.tarefas 
FOR DELETE 
TO authenticated
USING (true);