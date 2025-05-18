// src/pages/dashboard/subjects.tsx
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import EditSubjectModal from '../../components/EditSubjectModal'
import type { Subject } from '../../types/subject'

const SubjectsPage: FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const navigate = useNavigate()

    // Fetch inicial
    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await api.get<Subject[]>('/api/subjects')
                setSubjects(res.data)
            } catch {
                setError('No se pudieron cargar las materias')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    // Actualizar lista tras edición
    const handleSaved = (updated: Subject) => {
        setSubjects(prev =>
            prev.map(s => (s.ID === updated.ID ? updated : s))
        )
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Materias</h2>
                <button
                    onClick={() => navigate('/dashboard/subjects/new')}
                    className="px-4 py-2 bg-[#c6ac8f] hover:bg-[#5e503f] text-[#0a0908] rounded"
                >
                    + Nueva
                </button>
            </div>

            {loading && <p>Cargando materias...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Código</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map(s => (
                            <tr key={s.ID} className="border-b">
                                <td className="p-3">{s.ID}</td>
                                <td className="p-3">{s.name}</td>
                                <td className="p-3">{s.code}</td>
                                <td className="p-3 space-x-2">
                                    <button
                                        onClick={() => setEditingId(s.ID)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Eliminar materia?')) return
                                            try {
                                                await api.delete(`/api/subjects/${s.ID}`)
                                                setSubjects(prev => prev.filter(x => x.ID !== s.ID))
                                            } catch {
                                                alert('Error al eliminar')
                                            }
                                        }}
                                        className="text-red-600 hover:underline"
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {subjects.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-3 text-center">
                                    No hay materias registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {editingId !== null && (
                <EditSubjectModal
                    id={editingId}
                    onClose={() => setEditingId(null)}
                    onSaved={handleSaved}
                />
            )}
        </>
    )
}

export default SubjectsPage
