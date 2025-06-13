package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/middleware"
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

	// Connect to DB (dsn comes from the DB_DSN env var or defaults to books.db)
	database.ConnectDB()

	// --- Gin engine ---------------------------------------------------------
	router := gin.New()
	router.Use(gin.Recovery())           // panic-safe
	router.Use(middleware.Logger())      // structured request logs
	router.Use(middleware.RateLimiter()) // Rate limetter
	router.Use(cors.Default())           // permissive CORS; tighten if needed

	// --- Swagger docs -------------------------------------------------------
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// --- API routes ---------------------------------------------------------
	routes.SetupRoutes(router)

	// --- Graceful shutdown --------------------------------------------------
	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		log.Println("🚦 Server running at http://localhost:8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("❌ Server failed to start: %v", err)
		}
	}()

	// Wait for Ctrl-C / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("🛑 Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ Server exited gracefully")
}
