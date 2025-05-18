// src/pages/dashboard/grades.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import type { Grade } from '../../types/grade'
import type { Subject } from '../../types/subject'
import type { Student } from '../../types/student'
import EditGradeModal from '../../components/EditGradeModal'

export default function GradesPage() {
    const [grades, setGrades] = useState<Grade[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)

    useEffect(() => {
        setLoading(true)
        setError('')

        Promise.all([
            api.get<Student[]>('/api/students'),
            api.get<Subject[]>('/api/subjects'),
            api.get<Grade[]>('/api/grades'),
        ])
            .then(([stuRes, subRes, grdRes]) => {
                const myStudents = stuRes.data
                setStudents(myStudents)
                setSubjects(subRes.data)

                // Sólo calificaciones de tus propios alumnos
                const myIds = new Set(myStudents.map(s => s.id))
                setGrades(grdRes.data.filter(g => myIds.has(g.student_id)))
            })
            .catch(() => {
                setError('No se pudieron cargar los datos')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const handleSaved = (updated: Grade) => {
        setGrades(prev => prev.map(g => g.id === updated.id ? updated : g))
    }

    const findName = (list: { id: number; name: string }[], id: number) =>
        list.find(x => x.id === id)?.name ?? String(id)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Calificaciones</h2>
                <Link
                    to="/dashboard/grades/new"
                    className="px-4 py-2 bg-[#c6ac8f] hover:bg-[#5e503f] text-[#0a0908] rounded"
                >
                    + Nueva
                </Link>
            </div>

            {loading && <p>Cargando calificaciones...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Estudiante</th>
                            <th className="p-3 text-left">Materia</th>
                            <th className="p-3 text-left">Nota</th>
                            <th className="p-3 text-left">Fecha</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map(g => (
                            <tr key={g.id} className="border-b">
                                <td className="p-3">{g.id}</td>
                                <td className="p-3">
                                    {findName(students.map(s => ({ id: s.id, name: s.name })), g.student_id)}
                                </td>
                                <td className="p-3">
                                    {findName(subjects.map(s => ({ id: s.ID, name: s.name })), g.subject_id)}
                                </td>
                                <td className="p-3">{g.score}</td>
                                <td className="p-3">
                                    {/* toma created_at y muestra solo YYYY-MM-DD */}
                                    {new Date(g.created_at).toISOString().slice(0, 10)}
                                </td>
                                <td className="p-3 space-x-2">
                                    <button
                                        onClick={() => setEditingId(g.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Eliminar calificación?')) return
                                            await api.delete(`/api/grades/${g.id}`)
                                            setGrades(prev => prev.filter(x => x.id !== g.id))
                                        }}
                                        className="text-red-600 hover:underline"
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {grades.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-3 text-center">
                                    No hay calificaciones registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {editingId !== null && (
                <EditGradeModal
                    grade={grades.find(g => g.id === editingId)!}
                    onClose={() => setEditingId(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    )
}
