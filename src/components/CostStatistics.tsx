import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CostStatistics() {
  const costStatistics = useQuery(api.statistics.getCostStatistics);

  if (!costStatistics) {
    return null;
  }

  return (
    <>
      {/* Cost Comparison Widget */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Comparativa de Gastos Anuales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Año Actual ({new Date().getFullYear()})</p>
            <p className="text-3xl font-bold text-blue-600">
              {costStatistics.currentYearCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Año Anterior ({new Date().getFullYear() - 1})</p>
            <p className="text-3xl font-bold text-gray-600">
              {costStatistics.previousYearCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Variación respecto al año anterior:</span>
            <span className={`text-sm font-medium ${
              costStatistics.percentageChange >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {costStatistics.percentageChange >= 0 ? '+' : ''}{costStatistics.percentageChange}%
            </span>
          </div>
        </div>
      </div>

      {/* Cost Chart */}
      {costStatistics.chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Evolución de Gastos por Año</h3>
          <div className="space-y-3">
            {costStatistics.chartData.map((data) => {
              const maxCost = Math.max(...costStatistics.chartData.map(d => d.cost));
              const percentage = maxCost > 0 ? (data.cost / maxCost) * 100 : 0;
              
              return (
                <div key={data.year} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-gray-600">{data.year}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-600 h-6 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {data.cost > 0 ? data.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
