package main

import (
	"fmt"

	"github.com/gin-contrib/cors" // ✅ CORS
	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/database"
	_ "github.com/hasan-kayan/TaskGo/docs"
	"github.com/hasan-kayan/TaskGo/routes"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	fmt.Println("🚀 Starting TaskGo API...")
	database.ConnectDB()

	r := gin.Default()

	// ✅ Enable CORS for all origins
	r.Use(cors.Default())

	// Swagger docs
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// App routes
	routes.SetupRoutes(r)

	fmt.Println("🚦 Running on :8080")
	r.Run(":8080")
}
