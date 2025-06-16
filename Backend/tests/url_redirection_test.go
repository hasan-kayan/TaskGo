package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/handlers"
	"github.com/stretchr/testify/assert"
)

// Response şeması
type urlResp struct {
	ProcessedURL string `json:"processed_url"`
}

func TestURLRedirectionOperation(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.POST("/process-url", handlers.ProcessURL)

	payload := gin.H{
		"url":       "HTTPS://BYFOOD.COM/Food-Experiences?query=ABC/",
		"operation": "redirection",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/process-url", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var resp urlResp
	assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp), "response JSON parse failed")

	// cleanRedirection Sadece path'i lowercase yapıyor, query aynen kalır
	expected := "https://www.byfood.com/food-experiences?query=ABC/"
	assert.Equal(t, expected, resp.ProcessedURL)
}
