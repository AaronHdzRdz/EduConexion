// handlers/grade_handler.go
package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm/models"
	"gorm/services"
)

type GradeHandler struct {
	svc *services.GradeService
}

func NewGradeHandler(svc *services.GradeService) *GradeHandler {
	return &GradeHandler{svc: svc}
}

// POST /api/grades
func (h *GradeHandler) Create(c *gin.Context) {
    var input models.Grade
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    // input.CreatedAt/UpdatedAt se llenan automáticamente
    out, err := h.svc.Create(&input)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, out)
}

// GET /api/grades/:id
func (h *GradeHandler) Get(c *gin.Context) {
	gradeID, err := strconv.ParseUint(c.Param("grade_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	studentID, err := strconv.ParseUint(c.Param("student_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id inválido"})
		return
	}

	g, err := h.svc.GetByID(uint(gradeID), uint(studentID))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Calificación no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, g)
}

// PUT /api/grades/:id
// handlers/grade_handler.go
func (h *GradeHandler) Update(c *gin.Context) {
    // 1) Parseo de grade_id
    gradeID, err := strconv.ParseUint(c.Param("grade_id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "grade_id inválido"})
        return
    }

    // 2) Solo esperamos el nuevo valor de "grade"
    var in struct {
        Grade float64 `json:"grade"`
    }
    if err := c.ShouldBindJSON(&in); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // 3) Llamada al service que solo actualiza la columna "grade"
    updated, err := h.svc.UpdateGrade(uint(gradeID), in.Grade)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, updated)
}

// DELETE /api/grades/:id
func (h *GradeHandler) Delete(c *gin.Context) {
    gid, err := strconv.ParseUint(c.Param("grade_id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "grade_id inválido"})
        return
    }
    if err := h.svc.Delete(uint(gid)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.Status(http.StatusNoContent)
}

// handlers/grade_handler.go
func (h *GradeHandler) ListByStudent(c *gin.Context) {
	sid, err := strconv.ParseUint(c.Param("student_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "student_id inválido"})
		return
	}
	list, err := h.svc.GetAllByStudent(uint(sid))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func (h *GradeHandler) List(c *gin.Context) {
	list, err := h.svc.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}
