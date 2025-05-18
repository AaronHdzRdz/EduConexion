// services/grade_service.go
package services

import (
    "gorm/models"
    "gorm.io/gorm"
)

type GradeService struct {
    DB *gorm.DB
}

func NewGradeService(db *gorm.DB) *GradeService {
    return &GradeService{DB: db}
}

func (s *GradeService) Create(g *models.Grade) (*models.Grade, error) {
    if err := s.DB.Create(g).Error; err != nil {
        return nil, err
    }
    return g, nil
}

func (s *GradeService) GetAllByUser(userID uint) ([]models.Grade, error) {
    var list []models.Grade
    err := s.DB.
        Joins("JOIN subject ON subject.id = grade.id_subject").
        Where("subject.user_id = ?", userID).
        Find(&list).Error
    return list, err
}

func (s *GradeService) GetByID(gradeID, studentID uint) (*models.Grade, error) {
    var g models.Grade
    err := s.DB.
        Where("grade_id = ? AND student_id = ?", gradeID, studentID).
        First(&g).Error
    return &g, err
}

// services/grade_service.go
func (s *GradeService) UpdateGrade(gradeID uint, newGrade float64) (*models.Grade, error) {
    // Actualiza solamente la columna "grade"
    if err := s.DB.
        Model(&models.Grade{}).
        Where("grade_id = ?", gradeID).
        Update("grade", newGrade).
        Error; err != nil {
        return nil, err
    }
    // Trae el registro actualizado para devolverlo
    var g models.Grade
    if err := s.DB.First(&g, "grade_id = ?", gradeID).Error; err != nil {
        return nil, err
    }
    return &g, nil
}


func (s *GradeService) Delete(gradeID uint) error {
    return s.DB.Delete(&models.Grade{}, gradeID).Error
}


// services/grade_service.go
func (s *GradeService) GetAllByStudent(studentID uint) ([]models.Grade, error) {
    var list []models.Grade
    err := s.DB.
        Where("student_id = ?", studentID).
        Find(&list).Error
    return list, err
}

func (s *GradeService) GetAll() ([]models.Grade, error) {
    var list []models.Grade
    if err := s.DB.Find(&list).Error; err != nil {
        return nil, err
    }
    return list, nil
}