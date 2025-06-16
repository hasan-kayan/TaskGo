package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
	"github.com/hasan-kayan/TaskGo/routes"
	"github.com/stretchr/testify/assert"
)

type Envelope struct {
	Success bool            `json:"success"`
	Data    json.RawMessage `json:"data"`
	Message string          `json:"message"`
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	os.Setenv("DB_DSN", "test.db")

	database.ConnectDB()
	database.DB.Exec("DROP TABLE IF EXISTS books")
	database.DB.AutoMigrate(&models.Book{})

	r := gin.Default()
	routes.SetupRoutes(r)
	return r
}

func TestHappyPath(t *testing.T) {
	router := setupTestRouter()

	book := models.Book{
		Title:  "Test Driven Development",
		Author: "Kent Beck",
		Year:   2003,
		Type:   "Programming",
	}
	var created models.Book

	t.Run("Create", func(t *testing.T) {
		body, _ := json.Marshal(book)
		req, _ := http.NewRequest("POST", "/books", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code, "❌ CreateBook should return 201 Created")
		parseEnvelope(t, w.Body.Bytes(), &created)
		assert.NotEqual(t, uuid.Nil, created.ID, "❌ Created book has nil UUID")
		t.Logf("✅ Created book with ID: %s", created.ID)
	})

	t.Run("GetByID", func(t *testing.T) {
		req, _ := http.NewRequest("GET", fmt.Sprintf("/books/%s", created.ID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code, "❌ GetBook should return 200 OK")
		var fetched models.Book
		parseEnvelope(t, w.Body.Bytes(), &fetched)
		assert.Equal(t, created.ID, fetched.ID)
		t.Logf("✅ Successfully fetched book by ID")
	})

	t.Run("Update", func(t *testing.T) {
		updated := models.Book{
			Title:  "Refactoring",
			Author: "Martin Fowler",
			Year:   1999,
			Type:   "Software",
		}
		body, _ := json.Marshal(updated)
		req, _ := http.NewRequest("PUT", fmt.Sprintf("/books/%s", created.ID), bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code, "❌ UpdateBook should return 200 OK")
		var updatedBook models.Book
		parseEnvelope(t, w.Body.Bytes(), &updatedBook)
		assert.Equal(t, "Refactoring", updatedBook.Title)
		t.Logf("✅ Updated book successfully")
	})

	t.Run("Delete", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", fmt.Sprintf("/books/%s", created.ID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code, "❌ DeleteBook should return 200 OK")
		t.Logf("✅ Deleted book successfully")
	})

	t.Run("GetAfterDelete", func(t *testing.T) {
		req, _ := http.NewRequest("GET", fmt.Sprintf("/books/%s", created.ID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code, "❌ Get after delete should return 404")
		t.Logf("✅ Book not found as expected after delete")
	})
}
