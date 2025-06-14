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
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
	"github.com/hasan-kayan/TaskGo/routes"
)

var createdID uint

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	os.Setenv("DB_DSN", "test.db")

	database.ConnectDB()
	database.DB.Exec("DROP TABLE IF EXISTS books")
	database.DB.AutoMigrate(&models.Book{})

	r := gin.New()
	routes.SetupRoutes(r)
	return r
}

func TestCreateBook(t *testing.T) {
	r := setupRouter()

	book := models.Book{
		Title:  "Test Book",
		Author: "Test Author",
		Year:   2023,
	}

	body, _ := json.Marshal(book)
	req, _ := http.NewRequest("POST", "/books", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Expected status 201, got %d", w.Code)
	}

	var response models.Book
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if response.ID == 0 {
		t.Fatalf("Expected valid ID, got 0")
	}
	createdID = response.ID
}

func TestGetAllBooks(t *testing.T) {
	r := setupRouter()

	req, _ := http.NewRequest("GET", "/books", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}
}

func TestGetBookByID(t *testing.T) {
	r := setupRouter()

	req, _ := http.NewRequest("GET", fmt.Sprintf("/books/%d", createdID), nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}
}

func TestUpdateBook(t *testing.T) {
	r := setupRouter()

	updatedBook := models.Book{
		Title:  "Updated Title",
		Author: "Updated Author",
		Year:   2025,
	}

	body, _ := json.Marshal(updatedBook)
	req, _ := http.NewRequest("PUT", fmt.Sprintf("/books/%d", createdID), bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}
}

func TestDeleteBook(t *testing.T) {
	r := setupRouter()

	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/books/%d", createdID), nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}
}

func TestCleanup(t *testing.T) {
	_ = os.Remove("test.db")
}
func TestFilterBooks(t *testing.T) {
	r := setupRouter()

	// create a book to filter
	book := models.Book{Title: "Test Filter", Author: "Somebody", Year: 2025}
	database.DB.Create(&book)

	req, _ := http.NewRequest("GET", "/books?title=filter", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}

	var resp struct {
		Success bool          `json:"success"`
		Data    []models.Book `json:"data"`
	}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if len(resp.Data) == 0 {
		t.Fatalf("Expected at least 1 book in filtered result")
	}
}
