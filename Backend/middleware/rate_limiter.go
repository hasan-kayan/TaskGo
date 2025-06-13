package middleware

import (
	"net"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// -----------------------------------------------------------------------------
// Visitor bookkeeping
// -----------------------------------------------------------------------------
type visitor struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var (
	mu       sync.Mutex
	visitors = make(map[string]*visitor)
)

// getVisitor returns the existing limiter for an IP or creates a new one.
func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	v, exists := visitors[ip]
	if !exists {
		// 60 req / minute, burst 30
		lim := rate.NewLimiter(rate.Every(time.Minute/60), 30)
		visitors[ip] = &visitor{limiter: lim, lastSeen: time.Now()}
		return lim
	}

	v.lastSeen = time.Now()
	return v.limiter
}

// background cleanup to avoid memory leak
func init() {
	go func() {
		for {
			time.Sleep(time.Minute)
			mu.Lock()
			for ip, v := range visitors {
				if time.Since(v.lastSeen) > 5*time.Minute {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()
}

// RateLimiter is a Gin middleware that limits each IP.
func RateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Best effort IP extraction
		ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
		if err != nil {
			ip = c.ClientIP()
		}

		limiter := getVisitor(ip)
		if !limiter.Allow() {
			c.AbortWithStatusJSON(429, gin.H{
				"success": false,
				"error":   "Too Many Requests",
			})
			return
		}

		c.Next()
	}
}
