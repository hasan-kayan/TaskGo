package database

import (
	"log"

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
	database, err := gorm.Open(sqlite.Open("books.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	database.AutoMigrate(&models.Book{})
	DB = database
}
