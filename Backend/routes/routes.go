package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/handlers"
)

func SetupRoutes(r *gin.Engine) {
	registerBookRoutes(r)
	registerUtilityRoutes(r)
	registerHealthRoutes(r) // 👈 add this
}
func registerHealthRoutes(r *gin.Engine) {
	r.GET("/health", handlers.HealthCheck)
}
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

func registerUtilityRoutes(r *gin.Engine) {
	r.POST("/process-url", handlers.ProcessURL)
}
