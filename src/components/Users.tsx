import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function Users() {
  const users = useQuery(api.users.listUsers) || [];
  const updateUserRole = useMutation(api.users.updateUserRole);
  const deleteUser = useMutation(api.users.deleteUser);

  const handleRoleChange = async (userId: string, newRole: "ADMIN" | "USER") => {
    try {
      await updateUserRole({ userId: userId as Id<"users">, role: newRole });
      toast.success("Rol de usuario actualizado");
    } catch (error) {
      toast.error("Error al actualizar el rol del usuario");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmail}? Se eliminarán todos sus datos.`)) {
      try {
        await deleteUser({ userId: userId as Id<"users"> });
        toast.success("Usuario eliminado");
      } catch (error) {
        toast.error("Error al eliminar el usuario");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        <div className="text-sm text-gray-600">
          Total: {users.length} usuarios
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-yellow-600 mr-3">⚠️</div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Zona de Administración</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Ten cuidado al modificar roles o eliminar usuarios. Los cambios son permanentes.
            </p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay usuarios registrados
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.name || "Sin nombre"}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN" 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    {user.emailVerificationTime && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Email verificado
                      </span>
                    )}
                    {user.isAnonymous && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Usuario anónimo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Registrado: {new Date(user._creationTime).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {/* Role Toggle */}
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as "ADMIN" | "USER")}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteUser(user._id, user.email || "usuario")}
                    className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded text-sm hover:bg-red-50 transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Admin Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Instrucciones</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Los administradores pueden gestionar todos los usuarios y datos del sistema</li>
          <li>• Los usuarios normales solo pueden ver y gestionar sus propios datos</li>
          <li>• Al eliminar un usuario se borran todos sus vehículos y mantenimientos</li>
          <li>• Asegúrate de tener al menos un administrador en el sistema</li>
        </ul>
      </div>
    </div>
  );
}
