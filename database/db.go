package database

import (
	"log"

	"github.com/hasan-kayan/TaskGo/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	database, err := gorm.Open(sqlite.Open("books.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	database.AutoMigrate(&models.Book{})
	DB = database
}
