// routes/grade_routes.go
package routes

import (
    "github.com/gin-gonic/gin"
    "gorm/handlers"
)
// routes/grade_routes.go
func SetupGradeRoutes(rg *gin.RouterGroup, h *handlers.GradeHandler) {
    grp := rg.Group("/grades")
    {
        grp.POST("", h.Create)                          // Crear
        grp.GET("", h.List)                             // Traer todo
        grp.GET("/student/:student_id", h.ListByStudent)// Filtrar por alumno
        grp.GET("/:grade_id/student/:student_id", h.Get)// Una calificación concreta
        grp.PUT("/:grade_id", h.Update)                 // Actualizar
        grp.DELETE("/:grade_id", h.Delete)              // Borrar
    }
}
