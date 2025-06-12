package handlers

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

type URLRequest struct {
	URL       string `json:"url" binding:"required"`
	Operation string `json:"operation" binding:"required,oneof=canonical redirection all"`
}

type URLResponse struct {
	ProcessedURL string `json:"processed_url"`
}

// ProcessURL godoc
// @Summary Process a URL based on operation type
// @Description Cleans or redirects the given URL
// @Tags URL
// @Accept json
// @Produce json
// @Param request body handlers.URLRequest true "URL and operation"
// @Success 200 {object} handlers.URLResponse
// @Failure 400 {object} map[string]string
// @Router /process-url [post]

func ProcessURL(c *gin.Context) {
	var req URLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	parsedURL, err := url.Parse(req.URL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Malformed URL"})
		return
	}

	switch req.Operation {
	case "canonical":
		cleanCanonical(parsedURL)
	case "redirection":
		cleanRedirection(parsedURL)
	case "all":
		cleanCanonical(parsedURL)
		cleanRedirection(parsedURL)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid operation"})
		return
	}

	c.JSON(http.StatusOK, URLResponse{ProcessedURL: parsedURL.String()})
}

func cleanCanonical(u *url.URL) {
	u.RawQuery = ""
	u.Fragment = ""
	u.Path = strings.TrimSuffix(u.Path, "/")
}

func cleanRedirection(u *url.URL) {
	u.Host = "www.byfood.com"
	u.Scheme = "https"
	u.Path = strings.ToLower(u.Path)
}
