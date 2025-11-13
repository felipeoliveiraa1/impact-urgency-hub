export type TaskCategory = 'fazer_agora' | 'agendar' | 'delegar' | 'eliminar';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  task_link: string | null;
  impacto: number;
  urgencia: number;
  complexidade: number;
  risco: number;
  impacto_norm: number | null;
  urgencia_norm: number | null;
  complexidade_norm: number | null;
  risco_norm: number | null;
  prioridade: number | null;
  categoria: TaskCategory | null;
  linha: number | null;
  coluna: number | null;
  created_at: string;
  updated_at: string;
}

export interface CellDensity {
  linha: number;
  coluna: number;
  count: number;
  tarefas: Tarefa[];
}
