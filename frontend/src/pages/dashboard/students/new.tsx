// src/pages/dashboard/students/new.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

const NewStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { name, group, email: email.toLowerCase() };
      const res = await api.post('/api/students', payload);
      if (res.status === 201) {
        navigate('/dashboard/students');
      } else {
        setError('Respuesta inesperada del servidor');
      }
    } catch {
      setError('No se pudo crear el alumno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Alumno</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Grupo</label>
          <input
            type="text"
            value={group}
            onChange={e => setGroup(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="A1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="juan.perez@example.com"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard/students')}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {loading ? 'Guardando...' : 'Crear Alumno'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewStudentPage;
