// src/pages/dashboard/students.tsx
import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Student } from '../../types/student';

// Representa la respuesta cruda del API (id en minúscula)
interface APIStudent {
  id: number;
  name: string;
  group: string;
  email: string;
}

// Lo que realmente usa tu UI

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1) Carga inicial: mapear id→id
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<APIStudent[]>('/api/students');
        console.log('Primer registro:', res.data[0]); // para depurar
        const mapped = res.data.map(s => ({
          id: s.id,
          name: s.name,
          group: s.group,
          email: s.email,
        }));
        setStudents(mapped);
      } catch {
        setError('No se pudo cargar los estudiantes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Filtrado
  const filtered = students.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      String(s.id).includes(term)
    );
  });

  // 3) Modal de edición
  const EditStudentModal: React.FC<{
    id: number;
    onClose: () => void;
    onSaved: (upd: Student) => void;
  }> = ({ id, onClose, onSaved }) => {
    const [name, setName] = useState('');
    const [group, setGroup] = useState('');
    const [email, setEmail] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
      api
        .get<APIStudent>(`/api/students/${id}`)
        .then(r => {
          setName(r.data.name);
          setGroup(r.data.group);
          setEmail(r.data.email);
        })
        .catch(() => setErr('No se pudo cargar los datos'));
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      try {
        const r = await api.put<APIStudent>(`/api/students/${id}`, {
          name,
          group,
          email,
        });
        const updated: Student = {
          id: r.data.id,
          name: r.data.name,
          group: r.data.group,
          email: r.data.email,
        };
        onSaved(updated);
        onClose();
      } catch {
        setErr('Error al guardar');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl mb-4">Editar Alumno #{id}</h2>
          {err && <p className="text-red-500 mb-2">{err}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre"
              required
              className="w-full p-2 border rounded"
            />
            <input
              value={group}
              onChange={e => setGroup(e.target.value)}
              placeholder="Grupo"
              required
              className="w-full p-2 border rounded"
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header + búsqueda */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/dashboard/students/new"
          className="px-4 py-2 bg-[#c6ac8f] hover:bg-[#5e503f] text-[#0a0908] rounded-lg transition"
        >
          + Nuevo Alumno
        </Link>
        <input
          type="text"
          placeholder="Buscar por ID, nombre o email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-64 px-4 py-2 border rounded-md"
        />
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabla */}
      {!loading && !error && (
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Grupo</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b last:border-none">
                  <td className="px-6 py-4">{s.id}</td>
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.group}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(s.id)}
                      className="text-sm font-medium underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm('¿Eliminar este alumno?')) return;
                        try {
                          await api.delete(`/api/students/${s.id}`);
                          setStudents(prev =>
                            prev.filter(x => x.id !== s.id)
                          );
                        } catch {
                          alert('Error al eliminar');
                        }
                      }}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    No hay alumnos que coincidan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {editingId !== null && (
        <EditStudentModal
          id={editingId}
          onClose={() => setEditingId(null)}
          onSaved={updated =>
            setStudents(prev =>
              prev.map(s => (s.id === updated.id ? updated : s))
            )
          }
        />
      )}
    </>
  );
}
