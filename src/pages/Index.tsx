import { useState } from 'react';
import { useTarefas } from '@/hooks/useTarefas';
import { MatrizEisenhower } from '@/components/MatrizEisenhower';
import { DashboardEstatisticas } from '@/components/DashboardEstatisticas';
import { FormularioTarefa } from '@/components/FormularioTarefa';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
const Index = () => {
  const {
    tarefas,
    isLoading
  } = useTarefas();
  const [showForm, setShowForm] = useState(false);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando matriz...</p>
      </div>;
  }
  return <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Matriz Nascimento          </h1>
            <p className="text-muted-foreground mt-1">
              Sistema avançado de priorização de tarefas
            </p>
          </div>
          
        </div>

        <DashboardEstatisticas tarefas={tarefas} />
        <MatrizEisenhower tarefas={tarefas} />
      </div>

      <FormularioTarefa open={showForm} onClose={() => setShowForm(false)} />
    </div>;
};
export default Index;