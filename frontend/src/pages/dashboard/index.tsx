// src/pages/dashboard/index.tsx
import React, { useState, useEffect } from 'react'
import api from '../../api/axios'

const DashboardHome: React.FC = () => {
  const [studentCount, setStudentCount] = useState(0)
  const [subjectCount, setSubjectCount] = useState(0)
  const [gradeCount, setGradeCount] = useState(0)

  useEffect(() => {
    Promise.all([
      api.get<{ id: number; name: string }[]>('/api/students'),
      api.get<{ ID: number; name: string }[]>('/api/subjects'),
      api.get<{ id: number; student_id: number }[]>('/api/grades'),
    ])
      .then(([stuRes, subRes, grdRes]) => {
        const myStudents = stuRes.data
        setStudentCount(myStudents.length)
        setSubjectCount(subRes.data.length)

        // Solo contamos las grades cuyos student_id están en nuestros alumnos
        const myIds = new Set(myStudents.map(s => s.id))
        const myGrades = grdRes.data.filter(g => myIds.has(g.student_id))
        setGradeCount(myGrades.length)
      })
      .catch(err => {
        console.error('Error al cargar conteos:', err)
        setStudentCount(0)
        setSubjectCount(0)
        setGradeCount(0)
      })
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Estudiantes</h3>
        <p className="text-4xl font-bold">{studentCount}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Materias</h3>
        <p className="text-4xl font-bold">{subjectCount}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Calificaciones</h3>
        <p className="text-4xl font-bold">{gradeCount}</p>
      </div>
    </div>
  )
}

export default DashboardHome
