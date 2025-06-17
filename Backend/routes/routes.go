package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/handlers"
)

// SetupRoutes attaches all route groups to the main Gin engine.
func SetupRoutes(r *gin.Engine) {
	registerHealthRoutes(r)
	registerBookRoutes(r)
	registerUtilityRoutes(r)
}

// HealthCheck endpoint for readiness/liveness probes.
func registerHealthRoutes(r *gin.Engine) {
	r.GET("/health", handlers.HealthCheck)
}

// CRUD routes for Book resource.
func registerBookRoutes(r *gin.Engine) {
	books := r.Group("/books")
	{
		books.GET("", handlers.GetBooks)
		books.POST("", handlers.CreateBook)
		books.GET("/:id", handlers.GetBook)
		books.PUT("/:id", handlers.UpdateBook)
		books.DELETE("/:id", handlers.DeleteBook)
	}
}

// Utility routes (e.g., URL processing)
func registerUtilityRoutes(r *gin.Engine) {
	r.POST("/process-url", handlers.ProcessURL)
}
