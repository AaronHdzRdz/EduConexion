// src/services/gradeService.ts
import api from "./axios";

export const getAllGrades = () => api.get("/grades");
export const getGradesByStudent = (id: number) =>
  api.get(`/grades/student/${id}`);
export const createGrade = (data: {
  student_id: number;
  id_subject: number;
  grade: number;
}) => api.post("/grades", data);
export const updateGrade = (id: number, grade: number) =>
  api.put(`/grades/${id}`, { grade });
export const deleteGrade = (id: number) => api.delete(`/grades/${id}`);
