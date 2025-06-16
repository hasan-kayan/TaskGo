package tests

import (
	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/handlers"
)

var isInitialized = false

// tests/router_setup_test.go   (veya mevcut helper dosyanız)
func testRouter() *gin.Engine {
	setupTestDB() // <--  ❗️ EKLENDİ
	gin.SetMode(gin.TestMode)

	r := gin.New()
	// Routes
	r.GET("/books", handlers.GetBooks)
	r.GET("/books/:id", handlers.GetBook)
	r.POST("/books", handlers.CreateBook)
	r.PUT("/books/:id", handlers.UpdateBook)
	r.DELETE("/books/:id", handlers.DeleteBook)
	r.GET("/ping", func(c *gin.Context) { c.String(200, "pong") })

	return r
}
