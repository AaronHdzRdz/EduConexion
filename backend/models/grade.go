// gorm/models/grade.go
package models

import (
	"time"

	"gorm.io/gorm"
)

type Grade struct {
	ID        uint           `gorm:"primaryKey;column:grade_id" json:"id"`
	StudentID uint           `gorm:"column:student_id;not null" json:"student_id"`
	SubjectID uint           `gorm:"column:id_subject;not null" json:"subject_id"`
	Score     float64        `gorm:"column:grade;not null" json:"score"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
