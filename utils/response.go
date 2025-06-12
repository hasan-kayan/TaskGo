package utils

import (
	"github.com/gin-gonic/gin"
)

// SuccessResponse sends a success message with data
func SuccessResponse(c *gin.Context, status int, message string, data interface{}) {
	c.JSON(status, gin.H{
		"success": true,
		"message": message,
		"data":    data,
	})
}

// ErrorResponse sends an error message
func ErrorResponse(c *gin.Context, status int, message string, err error) {
	c.JSON(status, gin.H{
		"success": false,
		"message": message,
		"error":   err.Error(),
	})
}

// BasicMessage sends just a message
func BasicMessage(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"success": true,
		"message": message,
	})
}
