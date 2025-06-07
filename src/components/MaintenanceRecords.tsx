import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function MaintenanceRecords() {
  const vehicles = useQuery(api.vehicles.listVehicles) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  
  const maintenanceRecords = useQuery(api.maintenance.listMaintenanceRecords, {
    vehicleId: selectedVehicle ? (selectedVehicle as Id<"vehicles">) : undefined,
    searchTerm: searchTerm || undefined,
  }) || [];
  
  const exportData = useQuery(api.maintenance.exportMaintenanceRecords) || [];
  
  const createRecord = useMutation(api.maintenance.createMaintenanceRecord);
  const updateRecord = useMutation(api.maintenance.updateMaintenanceRecord);
  const deleteRecord = useMutation(api.maintenance.deleteMaintenanceRecord);

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    repairDate: "",
    currentKm: "",
    observations: "",
    cost: "",
  });

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      repairDate: "",
      currentKm: "",
      observations: "",
      cost: "",
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRecord) {
        await updateRecord({
          recordId: editingRecord._id as Id<"maintenanceRecords">,
          vehicleId: formData.vehicleId as Id<"vehicles">,
          repairDate: formData.repairDate,
          currentKm: parseInt(formData.currentKm),
          observations: formData.observations,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
        });
        toast.success("Mantenimiento actualizado");
      } else {
        await createRecord({
          vehicleId: formData.vehicleId as Id<"vehicles">,
          repairDate: formData.repairDate,
          currentKm: parseInt(formData.currentKm),
          observations: formData.observations,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
        });
        toast.success("Mantenimiento registrado");
      }
      resetForm();
    } catch (error) {
      toast.error("Error al guardar el mantenimiento");
    }
  };

  const handleEdit = (record: any) => {
    setFormData({
      vehicleId: record.vehicleId,
      repairDate: record.repairDate,
      currentKm: record.currentKm.toString(),
      observations: record.observations,
      cost: record.cost?.toString() || "",
    });
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (recordId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      try {
        await deleteRecord({ recordId: recordId as Id<"maintenanceRecords"> });
        toast.success("Registro eliminado");
      } catch (error) {
        toast.error("Error al eliminar el registro");
      }
    }
  };

  const handleExport = () => {
    if (exportData.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const csvContent = [
      ["Fecha", "Marca", "Modelo", "Matrícula", "Kilómetros", "Edad Vehículo", "Coste", "Observaciones"],
      ...exportData.map(record => [
        record.fecha,
        record.marca,
        record.modelo,
        record.matricula,
        record.kilometros,
        record.edad_vehiculo,
        record.coste,
        record.observaciones
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `mantenimientos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Datos exportados");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mantenimientos</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Exportar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por observaciones, marca, modelo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Vehículo
            </label>
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
            <h3 className="text-lg font-semibold mb-4">
              {editingRecord ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehículo
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Reparación
                </label>
                <input
                  type="date"
                  value={formData.repairDate}
                  onChange={(e) => setFormData({ ...formData, repairDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kilómetros Actuales
                </label>
                <input
                  type="number"
                  value={formData.currentKm}
                  onChange={(e) => setFormData({ ...formData, currentKm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coste (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  placeholder="Importe pagado (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                  placeholder="Describe el mantenimiento realizado..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingRecord ? "Actualizar" : "Crear"}
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
        {maintenanceRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay registros de mantenimiento
          </div>
        ) : (
          maintenanceRecords.map((record) => (
            <div key={record._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {record.vehicle?.brand} {record.vehicle?.model}
                  </h3>
                  <p className="text-gray-600">
                    {record.vehicle?.licensePlate} • {record.currentKm.toLocaleString()} km
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.repairDate).toLocaleDateString()} • {record.vehicleAge} años
                    {record.cost && ` • ${record.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      {record.observations.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
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
