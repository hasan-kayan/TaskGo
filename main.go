package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/routes"
)

func main() {
	fmt.Println("🚀 Starting TaskGo API...")

	fmt.Println("🔌 Connecting to DB")
	database.ConnectDB()

	fmt.Println("🌐 Setting up routes")
	r := gin.Default()
	routes.SetupRoutes(r)

	fmt.Println("🚦 Running on :8080")
	r.Run(":8080")
}
