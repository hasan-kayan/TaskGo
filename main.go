package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/routes"

	_ "github.com/hasan-kayan/TaskGo/docs" // <- needed for swaggo to register routes
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title TaskGo API
// @version 1.0
// @description This is the API for TaskGo, a task management application.
// @termsOfService http://example.com/terms/

// @contact.name API Support
// @contact.url http://example.com/support
// @contact.email support@example.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /
func main() {
	fmt.Println("🚀 Starting TaskGo API...")

	fmt.Println("🔌 Connecting to DB")
	database.ConnectDB()

	fmt.Println("🌐 Setting up routes")
	r := gin.Default()
	// ✅ Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	routes.SetupRoutes(r)

	fmt.Println("🚦 Running on :8080")
	r.Run(":8080")
}
