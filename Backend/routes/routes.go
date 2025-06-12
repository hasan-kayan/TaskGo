package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/handlers"
)

func SetupRoutes(r *gin.Engine) {
	books := r.Group("/books")
	{
		books.GET("", handlers.GetBooks)
		books.POST("", handlers.CreateBook)
		books.GET("/:id", handlers.GetBook)
		books.PUT("/:id", handlers.UpdateBook)
		books.DELETE("/:id", handlers.DeleteBook)
	}
}
