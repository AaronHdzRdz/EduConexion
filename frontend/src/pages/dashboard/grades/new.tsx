// src/pages/dashboard/grades/new.tsx
import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axios'
import type { Student } from '../../../types/student'
import type { Subject } from '../../../types/subject'

export default function NewGradePage() {
    const nav = useNavigate()
    const [students, setStudents] = useState<Student[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [studentID, setStudentID] = useState<number>()
    const [subjectID, setSubjectID] = useState<number>()
    const [score, setScore] = useState<number>(0)
    const [err, setErr] = useState('')

    useEffect(() => {
        api.get<Student[]>('/api/students')
            .then(r => setStudents(r.data))
            .catch(() => { })
        api.get<Subject[]>('/api/subjects')
            .then(r => setSubjects(r.data))
            .catch(() => { })
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!studentID || !subjectID) {
            setErr('Selecciona alumno y materia')
            return
        }
        try {
            await api.post('/api/grades', {
                student_id: studentID,
                subject_id: subjectID,
                score: score
            })
            nav('/dashboard/grades')
        } catch {
            setErr('No se pudo crear la calificación')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl mb-4">Crear Nueva Calificación</h2>
            {err && <p className="text-red-500 mb-2">{err}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="student-id" className="block mb-1">Estudiante</label>
                    <select
                        id="student-id"
                        value={studentID ?? ''}
                        onChange={e => setStudentID(+e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="" disabled>-- Selecciona alumno --</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} (ID: {s.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="subject-id" className="block mb-1">Materia</label>
                    <select
                        id="subject-id"
                        value={subjectID ?? ''}
                        onChange={e => setSubjectID(+e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="" disabled>-- Selecciona materia --</option>
                        {subjects.map(sub => (
                            <option key={sub.ID} value={sub.ID}>
                                {sub.name} (Código: {sub.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="score" className="block mb-1">Nota</label>
                    <input
                        id="score"
                        type="number"
                        step="0.01"
                        value={score}
                        onChange={e => setScore(+e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                        placeholder="0.00 – 100.00"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => nav('/dashboard/grades')}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Crear
                    </button>
                </div>
            </form>
        </div>
    )
}
