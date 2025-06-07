import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ColorBadge } from './ColorBadge';

export function ScheduledMaintenance() {
  const vehicles = useQuery(api.vehicles.listVehicles) || [];
  const scheduledMaintenance = useQuery(api.scheduledMaintenance.listScheduledMaintenance) || [];
  const upcomingMaintenance = useQuery(api.scheduledMaintenance.getUpcomingMaintenance) || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const createScheduled = useMutation(api.scheduledMaintenance.createScheduledMaintenance);
  const updateScheduled = useMutation(api.scheduledMaintenance.updateScheduledMaintenance);
  const deleteScheduled = useMutation(api.scheduledMaintenance.deleteScheduledMaintenance);

  const [showForm, setShowForm] = useState(false);
  const [editingScheduled, setEditingScheduled] = useState<any>(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    everyXYears: '',
    everyXKm: '',
    observations: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      everyXYears: '',
      everyXKm: '',
      observations: '',
      isActive: true,
    });
    setEditingScheduled(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.everyXYears && !formData.everyXKm) {
      toast.error('Debe especificar al menos un criterio (años o kilómetros)');
      return;
    }

    try {
      if (editingScheduled) {
        await updateScheduled({
          scheduleId: editingScheduled._id as Id<'scheduledMaintenance'>,
          vehicleId: formData.vehicleId as Id<'vehicles'>,
          everyXYears: formData.everyXYears ? parseFloat(formData.everyXYears) : undefined,
          everyXKm: formData.everyXKm ? parseInt(formData.everyXKm) : undefined,
          observations: formData.observations,
          isActive: formData.isActive,
        });
        toast.success('Mantenimiento programado actualizado');
      } else {
        await createScheduled({
          vehicleId: formData.vehicleId as Id<'vehicles'>,
          everyXYears: formData.everyXYears ? parseFloat(formData.everyXYears) : undefined,
          everyXKm: formData.everyXKm ? parseInt(formData.everyXKm) : undefined,
          observations: formData.observations,
        });
        toast.success('Mantenimiento programado creado');
      }
      resetForm();
    } catch (error) {
      toast.error('Error al guardar el mantenimiento programado');
    }
  };

  const handleEdit = (scheduled: any) => {
    setFormData({
      vehicleId: scheduled.vehicleId,
      everyXYears: scheduled.everyXYears?.toString() || '',
      everyXKm: scheduled.everyXKm?.toString() || '',
      observations: scheduled.observations,
      isActive: scheduled.isActive,
    });
    setEditingScheduled(scheduled);
    setShowForm(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mantenimiento programado?')) {
      try {
        await deleteScheduled({ scheduleId: scheduleId as Id<'scheduledMaintenance'> });
        toast.success('Mantenimiento programado eliminado');
      } catch (error) {
        toast.error('Error al eliminar el mantenimiento programado');
      }
    }
  };

  return (
    <div className="space-y-6">
      {' '}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Mantenimiento Programado</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2 sm:mt-0"
        >
          + Crear Mnto Programado
        </button>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descripción, marca, modelo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Vehículo</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los vehículos</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Upcoming Maintenance Alert */}
      {upcomingMaintenance.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Mantenimientos Próximos o Vencidos ({upcomingMaintenance.length})</h3>
          <div className="space-y-2">
            {upcomingMaintenance.map((item) => (
              <div key={item._id} className="bg-white border border-red-300 rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
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
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{item.observations}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Scheduled Maintenance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingScheduled ? 'Editar Mantenimiento Programado' : 'Nuevo Mantenimiento Programado'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cada X Años (opcional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.everyXYears}
                  onChange={(e) => setFormData({ ...formData, everyXYears: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  placeholder="Ej: 1, 0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cada X Kilómetros (opcional)</label>
                <input
                  type="number"
                  value={formData.everyXKm}
                  onChange={(e) => setFormData({ ...formData, everyXKm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  placeholder="Ej: 10000, 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Mantenimiento</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                  placeholder="Ej: Cambio de aceite, Revisión general..."
                />
              </div>

              {editingScheduled && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Mantenimiento activo
                  </label>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {editingScheduled ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{' '}
      {/* Scheduled Maintenance List */}
      <div className="space-y-4">
        {scheduledMaintenance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay mantenimientos programados</div>
        ) : (
          scheduledMaintenance
            .filter((scheduled) => {
              // Filtrar por vehículo si hay uno seleccionado
              if (selectedVehicle && scheduled.vehicleId !== selectedVehicle) {
                return false;
              }

              // Filtrar por término de búsqueda
              if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                  scheduled.observations.toLowerCase().includes(searchLower) ||
                  scheduled.vehicle?.brand.toLowerCase().includes(searchLower) ||
                  scheduled.vehicle?.model.toLowerCase().includes(searchLower) ||
                  scheduled.vehicle?.licensePlate.toLowerCase().includes(searchLower)
                );
              }

              return true;
            })
            .map((scheduled) => (
              <div key={scheduled._id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {' '}
                    <h3 className="text-lg font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <ColorBadge color={scheduled.vehicle?.color} size="lg" />
                        {scheduled.vehicle?.brand} {scheduled.vehicle?.model}
                      </div>
                    </h3>
                    <p className="text-gray-600">{scheduled.vehicle?.licensePlate}</p>
                    <div className="mt-2 space-y-1">
                      {scheduled.everyXYears && <p className="text-sm text-blue-600">📅 Cada {scheduled.everyXYears} años</p>}
                      {scheduled.everyXKm && <p className="text-sm text-blue-600">🛣️ Cada {scheduled.everyXKm.toLocaleString()} km</p>}
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{scheduled.observations}</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${scheduled.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-sm text-gray-600">{scheduled.isActive ? 'Activo' : 'Inactivo'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(scheduled)} className="text-blue-600 hover:text-blue-800 p-2">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(scheduled._id)} className="text-red-600 hover:text-red-800 p-2">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
