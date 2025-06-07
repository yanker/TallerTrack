import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ColorBadge } from './ColorBadge';

export function Vehicles() {
  const vehicles = useQuery(api.vehicles.listVehicles) || [];
  const createVehicle = useMutation(api.vehicles.createVehicle);
  const updateVehicle = useMutation(api.vehicles.updateVehicle);
  const deleteVehicle = useMutation(api.vehicles.deleteVehicle);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    purchaseDate: '',
    initialKm: '',
    brand: '',
    model: '',
    licensePlate: '',
    color: '#3B82F6', // Color por defecto (azul)
    otherDetails: '',
  });

  const resetForm = () => {
    setFormData({
      purchaseDate: '',
      initialKm: '',
      brand: '',
      model: '',
      licensePlate: '',
      color: '#3B82F6', // Color por defecto (azul)
      otherDetails: '',
    });
    setEditingVehicle(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVehicle) {
        await updateVehicle({
          vehicleId: editingVehicle._id,
          purchaseDate: formData.purchaseDate,
          initialKm: parseInt(formData.initialKm),
          brand: formData.brand,
          model: formData.model,
          licensePlate: formData.licensePlate,
          color: formData.color,
          otherDetails: formData.otherDetails || undefined,
        });
        toast.success('Vehículo actualizado');
      } else {
        await createVehicle({
          purchaseDate: formData.purchaseDate,
          initialKm: parseInt(formData.initialKm),
          brand: formData.brand,
          model: formData.model,
          licensePlate: formData.licensePlate,
          color: formData.color,
          otherDetails: formData.otherDetails || undefined,
        });
        toast.success('Vehículo creado');
      }
      resetForm();
    } catch (error) {
      toast.error('Error al guardar el vehículo');
    }
  };

  const handleEdit = (vehicle: any) => {
    setFormData({
      purchaseDate: vehicle.purchaseDate,
      initialKm: vehicle.initialKm.toString(),
      brand: vehicle.brand,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color || '#3B82F6', // Usar el color existente o el predeterminado
      otherDetails: vehicle.otherDetails || '',
    });
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo? Se eliminarán todos sus mantenimientos.')) {
      try {
        await deleteVehicle({ vehicleId: vehicleId as Id<'vehicles'> });
        toast.success('Vehículo eliminado');
      } catch (error) {
        toast.error('Error al eliminar el vehículo');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vehículos</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Agregar Vehículo
        </button>
      </div>

      {/* Vehicle Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Compra</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros Iniciales</label>
                <input
                  type="number"
                  value={formData.initialKm}
                  onChange={(e) => setFormData({ ...formData, initialKm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color del vehículo</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#000000', '#71717A'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900 ring-2 ring-blue-500' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-8 w-8 cursor-pointer border rounded-full overflow-hidden"
                    title="Personalizar color"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ColorBadge color={formData.color} size="md" />
                  <span>El color seleccionado se mostrará junto a la marca y modelo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Otros Detalles</label>
                <textarea
                  value={formData.otherDetails}
                  onChange={(e) => setFormData({ ...formData, otherDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {editingVehicle ? 'Actualizar' : 'Crear'}
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

      {/* Vehicles List */}
      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay vehículos registrados</div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ColorBadge color={vehicle.color} size="lg" />
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-gray-600">Matrícula: {vehicle.licensePlate}</p>
                  <p className="text-sm text-gray-500">Comprado: {new Date(vehicle.purchaseDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Km iniciales: {vehicle.initialKm.toLocaleString()}</p>
                  {vehicle.otherDetails && <p className="text-sm text-gray-600 mt-2">{vehicle.otherDetails}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(vehicle)} className="text-blue-600 hover:text-blue-800 p-2">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(vehicle._id)} className="text-red-600 hover:text-red-800 p-2">
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
