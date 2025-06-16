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
	"github.com/stretchr/testify/require"
)

func TestProcessURL(t *testing.T) {
	r := gin.New()
	r.POST("/process-url", handlers.ProcessURL)

	cases := []struct {
		name    string
		payload gin.H
		status  int
	}{
		{
			name: "canonical",
			payload: gin.H{
				"url":       "https://BYFOOD.com/food-EXPeriences?query=abc/",
				"operation": "canonical",
			},
			status: http.StatusOK,
		},
		{
			name: "bad_operation",
			payload: gin.H{
				"url":       "https://byfood.com",
				"operation": "foo",
			},
			status: http.StatusBadRequest,
		},
		{
			name: "missing_url",
			payload: gin.H{
				"operation": "all",
			},
			status: http.StatusBadRequest,
		},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			b, _ := json.Marshal(tc.payload)
			req, _ := http.NewRequest("POST", "/process-url", bytes.NewBuffer(b))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, tc.status, w.Code)

			if w.Code == http.StatusOK {
				var out map[string]string
				require.NoError(t, json.Unmarshal(w.Body.Bytes(), &out))
				assert.NotEmpty(t, out["processed_url"])
				t.Logf("✅ %s -> %s", tc.name, out["processed_url"])
			} else {
				t.Logf("⚠️  %s rejected as expected", tc.name)
			}
		})
	}
}
