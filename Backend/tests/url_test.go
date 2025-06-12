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

func TestProcessURL(t *testing.T) {
	router := gin.Default()
	router.POST("/process-url", handlers.ProcessURL)

	tests := []struct {
		name           string
		payload        map[string]string
		expectedStatus int
		expectedURL    string
	}{
		{
			name: "Canonical",
			payload: map[string]string{
				"url":       "https://BYFOOD.com/food-EXPeriences?query=abc/",
				"operation": "canonical",
			},
			expectedStatus: 200,
			expectedURL:    "https://BYFOOD.com/food-EXPeriences",
		},
		{
			name: "Redirection",
			payload: map[string]string{
				"url":       "https://BYFOOD.com/food-EXPeriences?query=abc/",
				"operation": "redirection",
			},
			expectedStatus: 200,
			expectedURL:    "https://www.byfood.com/food-experiences?query=abc/",
		},
		{
			name: "All",
			payload: map[string]string{
				"url":       "https://BYFOOD.com/food-EXPeriences?query=abc/",
				"operation": "all",
			},
			expectedStatus: 200,
			expectedURL:    "https://www.byfood.com/food-experiences",
		},
		{
			name: "Missing fields",
			payload: map[string]string{
				"url": "",
			},
			expectedStatus: 400,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.payload)

			req, _ := http.NewRequest("POST", "/process-url", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			if tt.expectedStatus == 200 {
				var resp map[string]string
				json.Unmarshal(w.Body.Bytes(), &resp)
				assert.Equal(t, tt.expectedURL, resp["processed_url"])
			}
		})
	}
}
