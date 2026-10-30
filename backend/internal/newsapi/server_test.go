package newsapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestNewsAPIRequiresAdminToPublishAndFiltersPublicNews(t *testing.T) {
	store, err := NewStore(filepath.Join(t.TempDir(), "data", "news.json"))
	if err != nil {
		t.Fatal(err)
	}
	handler := NewHandler(store, "secret-admin-token")

	adminSession := httptest.NewRequest(http.MethodGet, "/api/admin/session", nil)
	adminSession.Header.Set("Authorization", "Bearer secret-admin-token")
	adminResponse := httptest.NewRecorder()
	handler.ServeHTTP(adminResponse, adminSession)
	if adminResponse.Code != http.StatusOK || adminResponse.Header().Get("Cache-Control") != "no-store" {
		t.Fatalf("admin session = status %d, cache-control %q", adminResponse.Code, adminResponse.Header().Get("Cache-Control"))
	}

	body := []byte(`{"title":"New regional aircraft","summary":"A new aircraft joined the island fleet.","category":"Aircraft"}`)
	unauthorized := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewReader(body))
	unauthorizedResponse := httptest.NewRecorder()
	handler.ServeHTTP(unauthorizedResponse, unauthorized)
	if unauthorizedResponse.Code != http.StatusUnauthorized {
		t.Fatalf("anonymous POST status = %d, want %d", unauthorizedResponse.Code, http.StatusUnauthorized)
	}

	create := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewReader(body))
	create.Header.Set("Authorization", "Bearer secret-admin-token")
	created := httptest.NewRecorder()
	handler.ServeHTTP(created, create)
	if created.Code != http.StatusCreated {
		t.Fatalf("admin POST status = %d, want %d: %s", created.Code, http.StatusCreated, created.Body)
	}
	var story map[string]any
	if err := json.Unmarshal(created.Body.Bytes(), &story); err != nil {
		t.Fatal(err)
	}
	if _, hasStatus := story["status"]; hasStatus {
		t.Fatal("news article unexpectedly contains a TBA/completion status")
	}

	list := httptest.NewRequest(http.MethodGet, "/api/news?category=Aircraft", nil)
	listed := httptest.NewRecorder()
	handler.ServeHTTP(listed, list)
	var stories []Story
	if err := json.Unmarshal(listed.Body.Bytes(), &stories); err != nil {
		t.Fatal(err)
	}
	if listed.Code != http.StatusOK || len(stories) != 1 || stories[0].Category != "Aircraft" {
		t.Fatalf("filtered GET = status %d, stories %#v", listed.Code, stories)
	}

	invalidFilter := httptest.NewRequest(http.MethodGet, "/api/news?category=NotAviation", nil)
	invalidFilterResponse := httptest.NewRecorder()
	handler.ServeHTTP(invalidFilterResponse, invalidFilter)
	if invalidFilterResponse.Code != http.StatusBadRequest {
		t.Fatalf("invalid category status = %d, want %d", invalidFilterResponse.Code, http.StatusBadRequest)
	}
}

func TestNewsStoreMigratesLegacyCategories(t *testing.T) {
	path := filepath.Join(t.TempDir(), "news.json")
	legacy := []byte(`[{"id":"legacy-1","title":"Spotters meet","summary":"Aviation gathering","category":"Spotting","status":"tba","createdAt":"2026-10-30T00:00:00Z"}]`)
	if err := os.WriteFile(path, legacy, 0o600); err != nil {
		t.Fatal(err)
	}
	store, err := NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	stories := store.List("Plane spotting")
	if len(stories) != 1 {
		t.Fatalf("migrated category stories = %#v", stories)
	}
	var persisted []map[string]any
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(data, &persisted); err != nil {
		t.Fatal(err)
	}
	if persisted[0]["category"] != "Plane spotting" {
		t.Fatalf("persisted category = %v", persisted[0]["category"])
	}
	if _, hasStatus := persisted[0]["status"]; hasStatus {
		t.Fatal("legacy TBA status remained after migration")
	}
}

func TestNewsAPIRequiresConfiguredAdminToken(t *testing.T) {
	store, err := NewStore(filepath.Join(t.TempDir(), "news.json"))
	if err != nil {
		t.Fatal(err)
	}
	handler := NewHandler(store, "")
	request := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewReader([]byte(`{}`)))
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusServiceUnavailable {
		t.Fatalf("unconfigured POST status = %d, want %d", response.Code, http.StatusServiceUnavailable)
	}
}

func TestNewsAPIRejectsInvalidInput(t *testing.T) {
	store, err := NewStore(filepath.Join(t.TempDir(), "news.json"))
	if err != nil {
		t.Fatal(err)
	}
	handler := NewHandler(store, "secret-admin-token")
	body := []byte(`{"title":" ","summary":"Details","category":"Community"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewReader(body))
	request.Header.Set("Authorization", "Bearer secret-admin-token")
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusBadRequest {
		t.Fatalf("invalid input status = %d, want %d", response.Code, http.StatusBadRequest)
	}
	if stories := store.List(""); len(stories) != 0 {
		t.Fatalf("invalid request stored %d stories", len(stories))
	}
}
