package database

import (
	"log"
	"os"

	"github.com/hasan-kayan/TaskGo/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB establishes a connection to the SQLite database using GORM.
// It initializes the database with the required schema by auto-migrating
// the Book model. If the connection fails, the function logs a fatal error
// and terminates the application.
//
// @Summary Connect to the database
// @Description Establishes a connection to the SQLite database and performs auto-migration for the Book model.
// @Tags Database
// @Success 200 {string} string "Database connection successful"
// @Failure 500 {string} string "Failed to connect to database"
func ConnectDB() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "books.db" // default file
	}
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	if err := db.AutoMigrate(&models.Book{}); err != nil {
		log.Fatal("❌ Migration failed:", err)
	}
	DB = db
}
