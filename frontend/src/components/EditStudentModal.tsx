// src/components/EditStudentModal.tsx
import React, { useEffect, useState, type FormEvent } from 'react';
import api from '../api/axios';

interface Props {
  id: number;
  onClose: () => void;
  onSaved: (updated: { name: string; group: string; email: string }) => void;
}

const EditStudentModal: React.FC<Props> = ({ id, onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/students/${id}`)
      .then(r => {
        setName(r.data.name);
        setGroup(r.data.group);
        setEmail(r.data.email);
      })
      .catch(() => setError('No se pudo cargar datos'));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/students/${id}`, { name, group, email });
      onSaved({ name, group, email });
      onClose();
    } catch {
      setError('Error al guardar');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Editar Alumno</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nombre"
          />
          <input
            value={group}
            onChange={e => setGroup(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Grupo"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Email"
            type="email"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
