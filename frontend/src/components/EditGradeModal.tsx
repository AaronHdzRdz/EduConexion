// src/components/EditGradeModal.tsx
import { useState, type FormEvent } from 'react'
import api from '../api/axios'
import type { Grade } from '../types/grade'

interface Props {
  grade: Grade
  onClose: () => void
  onSaved: (updated: Grade) => void
}

export default function EditGradeModal({ grade, onClose, onSaved }: Props) {
  const [score, setScore] = useState<number>(grade.score)
  const [err, setErr] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // Sólo enviamos el campo "grade" pues el handler de Go espera
      const res = await api.put<Grade>(`/api/grades/${grade.id}`, {
        grade: score
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
        <h2 className="text-xl mb-4">Editar Calificación #{grade.id}</h2>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nota</label>
            <input
              type="number"
              step="0.01"
              value={score}
              onChange={e => setScore(+e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="0.00 – 100.00"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
