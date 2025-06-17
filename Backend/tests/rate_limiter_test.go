package tests

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/middleware"
	"github.com/stretchr/testify/assert"
)

// helpers --------------------------------------------------------------------

func setupRateLimiterRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.Use(middleware.RateLimiter()) // env-driven limiter
	r.GET("/ping", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	return r
}

// tests ----------------------------------------------------------------------

func TestRateLimiterBlocksAfterBurst(t *testing.T) {
	// --- Arrange -------------------------------------------------------------
	//  ► Limit: 5 istek/dakika, burst = 2
	os.Setenv("RATE_LIMIT_REQUESTS_PER_MIN", "5")
	os.Setenv("RATE_LIMIT_BURST", "2")

	router := setupRateLimiterRouter()
	ip := "127.0.0.1:12345"

	// --- Act & Assert --------------------------------------------------------
	// 1-2. İzin verilen burst istekleri OK dönmeli
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/ping", nil)
		req.RemoteAddr = ip
		rec := httptest.NewRecorder()

		router.ServeHTTP(rec, req)
		assert.Equal(t, http.StatusOK, rec.Code, "allowed request #%d should pass", i+1)
	}

	// 3. istekte bloklanmalı
	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.RemoteAddr = ip
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusTooManyRequests, rec.Code, "burst exceeded: should be 429")
}
