package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// sharedBook stores the book ID between tests
var sharedBookID string

// ───────────────────────────────────────────────────────────
// CREATE BOOK : 201
// ───────────────────────────────────────────────────────────
func TestCreateBook_Success(t *testing.T) {
	r := testRouter()

	payload := gin.H{
		"title":  "Test Driven Development",
		"author": "Kent Beck",
		"year":   2003,
		"type":   "Programming",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/books", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)

	var resp map[string]interface{}
	json.Unmarshal(rec.Body.Bytes(), &resp)

	id := resp["data"].(map[string]interface{})["id"].(string)
	sharedBookID = id // store for subsequent tests
}

// ───────────────────────────────────────────────────────────
// GET BOOK : 200
// ───────────────────────────────────────────────────────────
func TestGetBook_Success(t *testing.T) {
	r := testRouter()

	req, _ := http.NewRequest("GET", "/books/"+sharedBookID, nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
}

// ───────────────────────────────────────────────────────────
// UPDATE BOOK : 200
// ───────────────────────────────────────────────────────────
func TestUpdateBook_Success(t *testing.T) {
	r := testRouter()

	update := gin.H{
		"title": "TDD Updated",
	}
	b, _ := json.Marshal(update)

	req, _ := http.NewRequest("PUT", fmt.Sprintf("/books/%s", sharedBookID), bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
}

// ───────────────────────────────────────────────────────────
// DELETE BOOK : 200
// ───────────────────────────────────────────────────────────
func TestDeleteBook_Success(t *testing.T) {
	r := testRouter()

	req, _ := http.NewRequest("DELETE", "/books/"+sharedBookID, nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
}
