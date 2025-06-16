package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/middleware"
	"github.com/stretchr/testify/assert"
)

func setupRateLimiterRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(middleware.Logger())
	r.Use(middleware.RateLimiter()) // Parametresiz kullanım
	r.GET("/ping", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	return r
}

func TestRateLimiterBlocksAfterLimit(t *testing.T) {
	router := setupRateLimiterRouter()

	// Varsayılan limiti tahminen 100 kabul ediyoruz
	for i := 0; i < 100; i++ {
		req, _ := http.NewRequest("GET", "/ping", nil)
		rec := httptest.NewRecorder()
		router.ServeHTTP(rec, req)
		assert.Equal(t, http.StatusOK, rec.Code)
	}

	// 101. istek: artık limit aşılmış olmalı
	req, _ := http.NewRequest("GET", "/ping", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusTooManyRequests, rec.Code)
}
