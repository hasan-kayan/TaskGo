package middleware

import (
	"net"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

/*───────────────────────────────────────────────────────────────*
|            Configuration ‒ read once at program start         |
*───────────────────────────────────────────────────────────────*/

var (
	rlRPS    = getIntEnv("RATE_LIMIT_RPS", 60)   // requests per second
	rlBurst  = getIntEnv("RATE_LIMIT_BURST", 30) // maximum burst size
	cleanTTL = time.Minute * 5                   // keep idle visitor structs
)

func getIntEnv(key string, def int) int {
	v, err := strconv.Atoi(os.Getenv(key))
	if err != nil || v <= 0 {
		return def
	}
	return v
}

/*───────────────────────────────────────────────────────────────*
|                    Visitor bookkeeping                        |
*───────────────────────────────────────────────────────────────*/

type visitor struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var (
	mu       sync.Mutex
	visitors = make(map[string]*visitor)
)

func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	if v, ok := visitors[ip]; ok {
		v.lastSeen = time.Now()
		return v.limiter
	}

	lim := rate.NewLimiter(rate.Limit(rlRPS), rlBurst)
	visitors[ip] = &visitor{limiter: lim, lastSeen: time.Now()}
	return lim
}

/*───────────────────────────────────────────────────────────────*
|                Background GC ‒ prevent leaks                  |
*───────────────────────────────────────────────────────────────*/

func init() {
	go func() {
		ticker := time.NewTicker(time.Minute)
		for range ticker.C {
			mu.Lock()
			for ip, v := range visitors {
				if time.Since(v.lastSeen) > cleanTTL {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()
}

/*───────────────────────────────────────────────────────────────*
|                   Gin middleware function                     |
*───────────────────────────────────────────────────────────────*/

// RateLimiter limits requests per IP based on env configuration.
//
// • `RATE_LIMIT_RPS`   – allowed requests **per second** (default 60)
// • `RATE_LIMIT_BURST` – burst size before throttling   (default 30)
func RateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
		if err != nil {
			ip = c.ClientIP() // fallback (covers proxies / unit-tests)
		}

		if !getVisitor(ip).Allow() {
			c.AbortWithStatusJSON(429, gin.H{
				"success": false,
				"error":   "Too Many Requests",
			})
			return
		}

		c.Next()
	}
}
