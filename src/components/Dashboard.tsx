import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CostStatistics } from './CostStatistics';
import { ColorBadge } from './ColorBadge';

export function Dashboard() {
  const vehicles = useQuery(api.vehicles.listVehicles) || [];
  const maintenanceRecords = useQuery(api.maintenance.listMaintenanceRecords, {}) || [];
  const upcomingMaintenance = useQuery(api.scheduledMaintenance.getUpcomingMaintenance) || [];
  const costStatistics = useQuery(api.statistics.getCostStatistics) || null;

  const totalVehicles = vehicles.length;
  const totalMaintenanceRecords = maintenanceRecords.length;
  const upcomingCount = upcomingMaintenance.length;

  // Recent maintenance (last 5)
  const recentMaintenance = maintenanceRecords.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚗</div>
            <div>
              <p className="text-sm text-gray-600">Vehículos</p>
              <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🔧</div>
            <div>
              <p className="text-sm text-gray-600">Mantenimientos</p>
              <p className="text-2xl font-bold text-gray-900">{totalMaintenanceRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⚠️</div>
            <div>
              <p className="text-sm text-gray-600">Próximos</p>
              <p className="text-2xl font-bold text-red-600">{upcomingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-sm text-gray-600">Gasto Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {costStatistics?.totalCost?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) || '0 €'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CostStatistics />

      {/* Upcoming Maintenance */}
      {upcomingCount > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">⚠️ Mantenimientos Próximos o Vencidos</h3>
          </div>
          <div className="p-4 space-y-3">
            {upcomingMaintenance.map((item) => (
              <div key={item._id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <ColorBadge color={item.vehicle?.color} size="md" />
                      {item.vehicle?.brand} {item.vehicle?.model}
                    </p>
                    <p className="text-sm text-gray-600">{item.vehicle?.licensePlate}</p>
                    <p className="text-sm text-red-600 font-medium">{item.nextDueInfo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.everyXYears && `Cada ${item.everyXYears} años`}
                      {item.everyXYears && item.everyXKm && ' | '}
                      {item.everyXKm && `Cada ${item.everyXKm} km`}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{item.observations}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Maintenance */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">🔧 Mantenimientos Recientes</h3>
        </div>
        <div className="p-4">
          {recentMaintenance.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay mantenimientos registrados</p>
          ) : (
            <div className="space-y-3">
              {recentMaintenance.map((record) => (
                <div key={record._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <ColorBadge color={record.vehicle?.color} size="md" />
                        {record.vehicle?.brand} {record.vehicle?.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.vehicle?.licensePlate} • {record.currentKm} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{new Date(record.repairDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{record.vehicleAge} años</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{record.observations.replace(/<[^>]*>/g, '')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
