// src/components/EditSubjectModal.tsx
import { useState, useEffect, type FormEvent } from 'react'
import api from '../api/axios'
import type { Subject } from '../types/subject'

interface Props {
    id: number
    onClose: () => void
    onSaved: (updated: Subject) => void
}

export default function EditSubjectModal({ id, onClose, onSaved }: Props) {
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [err, setErr] = useState('')

    // Carga datos actuales
    useEffect(() => {
        api.get<Subject>(`/api/subjects/${id}`)
            .then(r => {
                setName(r.data.name)
                setCode(r.data.code)
            })
            .catch(() => setErr('No se pudo cargar la materia'))
    }, [id])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const res = await api.put<Subject>(`/api/subjects/${id}`, {
                name, code
            })
            onSaved(res.data)
            onClose()
        } catch {
            setErr('Error al guardar cambios')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl mb-4">Editar Materia #{id}</h2>
                {err && <p className="text-red-500 mb-2">{err}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Nombre</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                            placeholder="Ingrese el nombre de la materia"
                            title="Nombre de la materia"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Código</label>
                        <input
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                            placeholder="Ingrese el código de la materia"
                            title="Código de la materia"
                        />
                    </div>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
