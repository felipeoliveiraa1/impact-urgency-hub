export const LegendaQuadrantes = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8 max-w-[700px] mx-auto">
      {/* Fazer Agora */}
      <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
        <h3 className="font-bold text-lg mb-1">Fazer Agora</h3>
        <p className="text-sm text-muted-foreground">Alto impacto + Alta urgência</p>
      </div>

      {/* Agendar */}
      <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
        <h3 className="font-bold text-lg mb-1">Agendar</h3>
        <p className="text-sm text-muted-foreground">Alto impacto + Baixa urgência</p>
      </div>

      {/* Delegar */}
      <div className="p-4 rounded-lg bg-yellow-50 border-2 border-yellow-200">
        <h3 className="font-bold text-lg mb-1">Delegar</h3>
        <p className="text-sm text-muted-foreground">Baixo impacto + Alta urgência</p>
      </div>

      {/* Eliminar */}
      <div className="p-4 rounded-lg bg-gray-50 border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-1">Eliminar</h3>
        <p className="text-sm text-muted-foreground">Baixo impacto + Baixa urgência</p>
      </div>
    </div>
  );
};
