import { useState } from 'react';
import { useTarefas } from '@/hooks/useTarefas';
import { MatrizEisenhower } from '@/components/MatrizEisenhower';
import { DashboardEstatisticas } from '@/components/DashboardEstatisticas';
import { LegendaQuadrantes } from '@/components/LegendaQuadrantes';
import { FormularioTarefa } from '@/components/FormularioTarefa';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const { tarefas, isLoading } = useTarefas();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-muted-foreground">Carregando matriz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Matriz de Eisenhower</h1>
            <p className="text-muted-foreground mt-1">
              Sistema de priorização 12×12
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardEstatisticas tarefas={tarefas} />

        {/* Matrix */}
        <MatrizEisenhower tarefas={tarefas} />

        {/* Legend */}
        <LegendaQuadrantes />
      </div>

      <FormularioTarefa
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default Index;
