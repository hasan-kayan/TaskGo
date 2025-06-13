package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next() // process request
		latency := time.Since(start)

		log.WithFields(log.Fields{
			"status":  c.Writer.Status(),
			"method":  c.Request.Method,
			"path":    c.Request.URL.Path,
			"latency": latency.String(),
			"client":  c.ClientIP(),
		}).Info("request completed")
	}
}
