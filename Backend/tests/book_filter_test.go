package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/uuid"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
	"github.com/stretchr/testify/assert"
)

func TestGetBooksWithFilters(t *testing.T) {
	r := testRouter()

	// 👉 veritabanına 2 kitap ekle
	bookA := models.Book{ID: uuid.New(), Title: "Clean Code", Author: "Robert", Year: 2008, Type: "Programming"}
	bookB := models.Book{ID: uuid.New(), Title: "Clean Architecture", Author: "Robert", Year: 2017, Type: "Programming"}
	database.DB.Create(&bookA)
	database.DB.Create(&bookB)

	req, _ := http.NewRequest("GET", "/books?title=architecture", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var result []models.Book
	parseEnvelope(t, rec.Body.Bytes(), &result)
	assert.Len(t, result, 1)
	assert.Equal(t, "Clean Architecture", result[0].Title)
}
