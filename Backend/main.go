package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/routes"

	_ "github.com/hasan-kayan/TaskGo/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title       TaskGo API
// @version     1.0
// @description API for managing books and processing URLs
// @host        localhost:8080
// @BasePath    /
func main() {
	log.Println("🚀 Starting TaskGo API...")

	// Just call it, don't assign it to a variable
	database.ConnectDB()

	router := gin.Default()
	router.Use(cors.Default())

	// Swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Routes
	routes.SetupRoutes(router)

	log.Println("🚦 Server running at http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}
