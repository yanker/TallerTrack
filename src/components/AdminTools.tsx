import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

export function AdminTools() {
  const initializeUserRoles = useMutation(api.migrations.initializeUserRoles);
  const cloneData = useMutation(api.migrations.cloneUserData);
  const users = useQuery(api.users.listUsers) || [];

  const handleInitializeRoles = async () => {
    if (confirm('¿Estás seguro de que quieres inicializar los roles de usuario? Esto asignará el rol ADMIN a yanker@gmail.com y USER al resto de usuarios.')) {
      try {
        const result = await initializeUserRoles();
        toast.success(`Roles inicializados exitosamente. ${result.updates.length} usuarios actualizados.`);
      } catch (error) {
        toast.error('Error al inicializar roles: ' + (error as Error).message);
      }
    }
  };

  const handleCloneData = async (sourceUserId: Id<"users">, targetUserId: Id<"users">) => {
    try {
      await cloneData({ sourceUserId, targetUserId });
      toast.success('Datos clonados exitosamente');
    } catch (error) {
      toast.error('Error al clonar datos: ' + (error as Error).message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Herramientas de Administración</h2>
      
      {/* Inicializar Roles */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Inicialización de Roles</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Esta acción asignará el rol de administrador a yanker@gmail.com y el rol de usuario al resto.
        </p>
        <button
          onClick={() => void handleInitializeRoles()}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
        >
          Inicializar Roles de Usuario
        </button>
      </div>

      {/* Clonar Datos */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Clonación de Datos</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Selecciona un usuario origen para clonar sus vehículos y registros de mantenimiento a otro usuario.
        </p>
        
        <div className="space-y-4">
          {users.map(sourceUser => (
            <div key={sourceUser._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{sourceUser.email}</h4>
                  <p className="text-sm text-gray-500">
                    Rol: {sourceUser.role === 'ADMIN' ? '👑 Administrador' : '👤 Usuario'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => {
                      const targetId = e.target.value;
                      if (targetId && targetId !== 'default') {
                        void handleCloneData(sourceUser._id as Id<"users">, targetId as Id<"users">);
                        e.target.value = 'default';
                      }
                    }}
                    className="px-3 py-2 border rounded text-sm"
                    defaultValue="default"
                  >
                    <option value="default" disabled>Seleccionar destino...</option>
                    {users
                      .filter(u => u._id !== sourceUser._id)
                      .map(targetUser => (
                        <option key={targetUser._id} value={targetUser._id}>
                          {targetUser.email}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
