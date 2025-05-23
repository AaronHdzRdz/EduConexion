package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"gorm/config"
	"gorm/database"
	"gorm/handlers"
	"gorm/middleware"
	"gorm/models"
	"gorm/routes"
	"gorm/services"
)

func main() {
	// 1) Carga .env
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ .env no encontrado, usando vars de entorno")
	}

	// 2) Carga configuración
	cfg := config.Load()

	// 3) Conecta a la base de datos
	dbConn, err := database.NewDatabase()
	if err != nil {
		log.Fatalf("❌ Error DB: %v", err)
	}
	log.Println("✅ Conectado a Postgres")

	// 4) Auto-migraciones
	if err := dbConn.DB.AutoMigrate(
		&models.User{},
		&models.Student{},
		&models.Subject{},
		&models.Grade{},
	); err != nil {
		log.Fatalf("❌ Migración fallida: %v", err)
	}

	// 5) Crea el router Gin (incluye Logger y Recovery)
	r := gin.Default()

	// 6) Ruta de prueba
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// 7) Auth (login/signup)
	userSvc := services.NewUserService(dbConn.DB)
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET no configurado")
	}
	userH := handlers.NewUserHandler(userSvc, jwtSecret)
	routes.SetupUserRoutes(r, userH)

	// 8) Grupo protegido con JWT
	api := r.Group("/api")
	api.Use(middleware.AuthJWT(jwtSecret))

	// 9) Students CRUD
	studentSvc := services.NewStudentService(dbConn.DB)
	studentH := handlers.NewStudentHandler(studentSvc)
	routes.SetupStudentRoutes(api, studentH)

	// 10) Subjects CRUD
	subjectSvc := services.NewSubjectService(dbConn.DB)
	subjectH := handlers.NewSubjectHandler(subjectSvc)
	routes.SetupSubjectRoutes(api, subjectH)

	// 11) Grades CRUD
	gradeSvc := services.NewGradeService(dbConn.DB)
	gradeH := handlers.NewGradeHandler(gradeSvc)
	routes.SetupGradeRoutes(api, gradeH)

	// 12) Arranca el servidor
	addr := fmt.Sprintf("0.0.0.0:%s", cfg.ServerPort)
	log.Printf("Servidor escuchando en %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ Error al arrancar servidor: %v", err)
	}
}
