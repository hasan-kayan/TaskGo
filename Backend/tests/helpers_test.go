package tests

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/hasan-kayan/TaskGo/models"
)

// API envelope şeması
type envelope struct {
	Success bool            `json:"success"`
	Data    json.RawMessage `json:"data"`
	Message string          `json:"message"`
}

// parseEnvelope çözücü:
//  1. JSON gövdesini envelope yapısına açar
//  2. env.Data alanını hedef struct'a (target) döker
func parseEnvelope(t *testing.T, body []byte, target any) {
	t.Helper()

	var env envelope
	if err := json.Unmarshal(body, &env); err != nil {
		t.Fatalf("❌ Failed to unmarshal envelope: %v", err)
	}
	if !env.Success {
		t.Fatalf("❌ API responded with success=false: %s", env.Message)
	}
	if err := json.Unmarshal(env.Data, target); err != nil {
		t.Fatalf("❌ Failed to unmarshal data field: %v", err)
	}
}

// parseError – utils.JSONError sarmalını çözer, sade mesaj döner
func parseError(t *testing.T, rec *httptest.ResponseRecorder) string {
	t.Helper()
	var errResp models.ErrorResponse
	_ = json.Unmarshal(rec.Body.Bytes(), &errResp)
	return errResp.Error
}
