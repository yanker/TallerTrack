import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ColorBadge } from './ColorBadge';

export function ScheduledMaintenance() {
  const vehicles = useQuery(api.vehicles.listVehicles) || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const scheduledMaintenances = useQuery(api.scheduledMaintenance.listScheduledMaintenance) || [];

  const exportData = useQuery(api.scheduledMaintenance.exportScheduledMaintenance) || [];
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
    } catch {
      toast.error('Error al guardar el mantenimiento programado');
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mantenimiento programado?')) {
      try {
        await deleteScheduled({ scheduleId: scheduleId as Id<'scheduledMaintenance'> });
        toast.success('Mantenimiento programado eliminado');
      } catch {
        toast.error('Error al eliminar el mantenimiento programado');
      }
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

  const handleExport = () => {
    if (exportData.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    // Añadir BOM para UTF-8
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      ['Marca', 'Modelo', 'Matrícula', 'Cada X Años', 'Cada X Km', 'Estado', 'Observaciones'],
      ...exportData.map((record) => [
        record.marca,
        record.modelo,
        record.matricula,
        record.cada_x_years,
        record.cada_x_km,
        record.estado,
        record.observaciones,
      ]),
    ]
      .map((row) => row.join(';'))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mantenimientos_programados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Datos exportados');
  };

  const filteredMaintenances = scheduledMaintenances.filter((scheduled) => {
    const matchesSearch =
      scheduled.observations.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheduled.vehicle?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheduled.vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVehicle = !selectedVehicle || scheduled.vehicleId === selectedVehicle;
    return matchesSearch && matchesVehicle;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Mantenimientos Programados</h2>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Exportar
          </button>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Programar Mnto
          </button>
        </div>
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

      {/* Maintenance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingScheduled ? 'Editar Mantenimiento Programado' : 'Nuevo Mantenimiento Programado'}</h3>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Cada X Años</label>
                <input
                  type="number"
                  value={formData.everyXYears}
                  onChange={(e) => setFormData({ ...formData, everyXYears: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.5"
                  min="0"
                  placeholder="Por ejemplo: 1, 0.5 para 6 meses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cada X Kilómetros</label>
                <input
                  type="number"
                  value={formData.everyXKm}
                  onChange={(e) => setFormData({ ...formData, everyXKm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  placeholder="Por ejemplo: 10000"
                />
              </div>

              {editingScheduled && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Mantenimiento activo
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                  placeholder="Describe el mantenimiento programado..."
                />
              </div>

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
      )}

      {/* Records List */}
      <div className="space-y-4">
        {filteredMaintenances.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay mantenimientos programados</div>
        ) : (
          filteredMaintenances.map((scheduled) => (
            <div key={scheduled._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ColorBadge color={scheduled.vehicle?.color} size="lg" />
                    {scheduled.vehicle?.brand} {scheduled.vehicle?.model}
                  </h3>
                  <p className="text-gray-600">{scheduled.vehicle?.licensePlate}</p>
                  <div>
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      void handleDelete(scheduled._id);
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
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
