// tests/test_helpers.go
package tests

import (
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() {
	if database.DB != nil {
		return // zaten hazır
	}
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("❌ TEST DB açılamadı: " + err.Error())
	}
	// global DB’yi atayın
	database.DB = db

	// şema
	_ = db.AutoMigrate(&models.Book{})
}
