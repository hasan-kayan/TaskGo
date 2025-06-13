package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck godoc
// @Summary Health Check
// @Description Returns 200 OK if the service is up
// @Tags Health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health [get]
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}
