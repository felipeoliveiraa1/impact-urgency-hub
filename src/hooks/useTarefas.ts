import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tarefa } from '@/types/tarefa';
import { useToast } from '@/hooks/use-toast';

export const useTarefas = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ['tarefas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .order('prioridade', { ascending: false });
      
      if (error) throw error;
      return data as Tarefa[];
    },
  });

  const createTarefa = useMutation({
    mutationFn: async (tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'impacto_norm' | 'urgencia_norm' | 'complexidade_norm' | 'risco_norm' | 'prioridade' | 'categoria' | 'linha' | 'coluna'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tarefas')
        .insert([{ ...tarefa, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] });
      toast({
        title: 'Tarefa criada',
        description: 'A tarefa foi adicionada à matriz com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTarefa = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Tarefa> & { id: string }) => {
      const { data, error } = await supabase
        .from('tarefas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] });
      toast({
        title: 'Tarefa atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteTarefa = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas'] });
      toast({
        title: 'Tarefa excluída',
        description: 'A tarefa foi removida da matriz.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir tarefa',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    tarefas,
    isLoading,
    createTarefa: createTarefa.mutate,
    updateTarefa: updateTarefa.mutate,
    deleteTarefa: deleteTarefa.mutate,
  };
};
