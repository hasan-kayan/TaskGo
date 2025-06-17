package database

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/hasan-kayan/TaskGo/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	gormlog "gorm.io/gorm/logger"
)

/*───────────────────────────────────────────────────────────────*
|                     ENV-driven settings                       |
*───────────────────────────────────────────────────────────────*/

// DB_DSN          → file path **or** special strings: ":memory:", "tmp"
// DB_LOG_MODE     → "silent" | "error" | "warn" | "info" (default "warn")
// DB_AUTO_MIGRATE → "true" | "false"  (default "true")
//
// Example `.env` (see below):
//
//   DB_DSN=tmp
//   DB_LOG_MODE=info
//   DB_AUTO_MIGRATE=true
//

/*───────────────────────────────────────────────────────────────*
|                   Public exported variable                    |
*───────────────────────────────────────────────────────────────*/

var DB *gorm.DB

/*───────────────────────────────────────────────────────────────*
|                    Connection bootstrapping                   |
*───────────────────────────────────────────────────────────────*/

// ConnectDB establishes the DB connection **once** at app start.
// Panics on failure ‒ we cannot serve traffic without a database.
func ConnectDB() {
	dsn := normalisedDSN(os.Getenv("DB_DSN"))
	logMode := parseLogLevel(os.Getenv("DB_LOG_MODE"))
	autoMigrate := strings.ToLower(os.Getenv("DB_AUTO_MIGRATE")) != "false"

	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{
		Logger: gormlog.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			gormlog.Config{
				SlowThreshold: time.Second,
				LogLevel:      logMode,
				Colorful:      true,
			},
		),
	})
	if err != nil {
		log.Fatalf("❌ database connection failed: %v", err)
	}

	if autoMigrate {
		if err := db.AutoMigrate(&models.Book{}); err != nil {
			log.Fatalf("❌ auto-migration failed: %v", err)
		}
	}

	DB = db
	log.Printf("✅ database initialised (%s)", dsn)
}

/*───────────────────────────────────────────────────────────────*
|                         helpers                               |
*───────────────────────────────────────────────────────────────*/

func normalisedDSN(val string) string {
	switch strings.TrimSpace(strings.ToLower(val)) {
	case "", "file", "prod":
		return "books.db" // persistent file
	case ":memory:", "mem", "memory":
		return "file::memory:?cache=shared" // pure in-memory (testing)
	case "tmp", "tmpfile":
		return "file:taskgo-temp.db?_fk=1" // temp file, auto-removed on exit
	default:
		return val // custom path supplied by user
	}
}

func parseLogLevel(lvl string) gormlog.LogLevel {
	switch strings.ToLower(lvl) {
	case "silent":
		return gormlog.Silent
	case "error":
		return gormlog.Error
	case "info":
		return gormlog.Info
	default: // empty or "warn"
		return gormlog.Warn
	}
}
