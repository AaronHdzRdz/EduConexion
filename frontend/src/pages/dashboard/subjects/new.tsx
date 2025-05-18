// src/pages/dashboard/subjects/new.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

export default function NewSubjectPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        type ApiError = {
            response?: {
                data?: {
                    error?: string;
                };
            };
        };

        try {
            await api.post('/api/subjects', { name, code });
            navigate('/dashboard/subjects');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            if (apiError && typeof apiError === 'object' && apiError.response?.data?.error) {
                setError(apiError.response.data.error ?? '');
            } else {
                setError('Error al crear');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl mb-4">Crear Materia</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label>Nombre</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={name} onChange={e => setName(e.target.value)}
                        required
                        placeholder="Ingrese el nombre de la materia"
                    />
                </div>
                <div>
                    <label>Código</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={code} onChange={e => setCode(e.target.value)}
                        required
                        placeholder="Ingrese el código de la materia"
                        title="Código de la materia"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/subjects')}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {loading ? 'Guardando...' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
}
