import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

export function Notes() {
  const notes = useQuery(api.notes.listNotes) || [];
  const createNote = useMutation(api.notes.createNote);
  const updateNote = useMutation(api.notes.updateNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Filtrar notas basado en búsqueda y fecha
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || note.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await updateNote({
          noteId: editingNote._id as Id<'notes'>,
          title: formData.title,
          details: formData.details,
          date: formData.date,
        });
        toast.success('Nota actualizada');
      } else {
        await createNote({
          title: formData.title,
          details: formData.details,
          date: formData.date,
        });
        toast.success('Nota creada');
      }
      resetForm();
    } catch {
      toast.error('Error al guardar la nota');
    }
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      try {
        await deleteNote({ noteId: noteId as Id<'notes'> });
        toast.success('Nota eliminada');
      } catch {
        toast.error('Error al eliminar la nota');
      }
    }
  };

  const handleEdit = (note: any) => {
    setFormData({
      title: note.title,
      details: note.details,
      date: note.date,
    });
    setEditingNote(note);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Notas Personales</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Nueva Nota
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
              placeholder="Buscar por título o contenido..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Fecha</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingNote ? 'Editar Nota' : 'Nueva Nota'}</h3>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Título de la nota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detalles</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                  placeholder="Escribe los detalles de tu nota..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {editingNote ? 'Actualizar' : 'Crear'}
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

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {notes.length === 0 ? 'No hay notas registradas' : 'No se encontraron notas con los filtros actuales'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                  <p className="text-sm text-purple-600 font-bold">{new Date(note.date).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.details}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(note)} className="text-blue-600 hover:text-blue-800 p-2">
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      void handleDelete(note._id);
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
