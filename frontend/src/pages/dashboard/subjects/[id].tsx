// src/pages/dashboard/subjects/[id].tsx
import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

export default function EditSubjectPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/subjects/${id}`)
            .then(r => {
                setName(r.data.name);
                setCode(r.data.code);
            })
            .catch(() => setError('No se pudo cargar'));
    }, [id]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.put(`/subjects/${id}`, { name, code });
            navigate('/dashboard/subjects');
        } catch (err: unknown) {
            if (
                err &&
                typeof err === 'object' &&
                'response' in err &&
                err.response &&
                typeof err.response === 'object' &&
                'data' in err.response &&
                err.response.data &&
                typeof err.response.data === 'object' &&
                'error' in err.response.data
            ) {
                type ApiError = {
                    response: {
                        data: {
                            error: string;
                        };
                    };
                };
                setError((err as ApiError).response.data.error);
            } else {
                setError('Error al guardar');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-2xl mb-4">Editar Materia</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label>Nombre</label>
                        <input
                            className="w-full border p-2 rounded"
                            value={name} onChange={e => setName(e.target.value)}
                            required
                            placeholder="Nombre de la materia"
                        />
                    </div>
                    <div>
                        <label>Código</label>
                        <input
                            className="w-full border p-2 rounded"
                            value={code} onChange={e => setCode(e.target.value)}
                            required
                            placeholder="Código de la materia"
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
                            className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
    );
}
