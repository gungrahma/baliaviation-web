package newsapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
)

func TestNewsAPIStoresStoriesAndStatusAcrossRestart(t *testing.T) {
	path := filepath.Join(t.TempDir(), "data", "news.json")
	store, err := NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	handler := NewHandler(store)
	body := []byte(`{"title":"Spotting morning","summary":"Meet at the airport lookout.","category":"Spotting","status":"tba"}`)
	create := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewReader(body))
	created := httptest.NewRecorder()
	handler.ServeHTTP(created, create)
	if created.Code != http.StatusCreated {
		t.Fatalf("create status = %d, want %d: %s", created.Code, http.StatusCreated, created.Body)
	}
	var story Story
	if err := json.Unmarshal(created.Body.Bytes(), &story); err != nil {
		t.Fatal(err)
	}

	statusBody := []byte(`{"status":"announced"}`)
	update := httptest.NewRequest(http.MethodPatch, "/api/news/"+story.ID, bytes.NewReader(statusBody))
	updated := httptest.NewRecorder()
	handler.ServeHTTP(updated, update)
	if updated.Code != http.StatusOK {
		t.Fatalf("update status = %d, want %d: %s", updated.Code, http.StatusOK, updated.Body)
	}

	restarted, err := NewStore(path)
	if err != nil {
		t.Fatal(err)
	}
	stories := restarted.List()
	if len(stories) != 1 || stories[0].Status != "announced" {
		t.Fatalf("reloaded stories = %#v, want one announced story", stories)
	}
}

func TestNewsAPIRejectsInvalidInput(t *testing.T) {
	store, err := NewStore(filepath.Join(t.TempDir(), "news.json"))
	if err != nil {
		t.Fatal(err)
	}
	handler := NewHandler(store)
	body := []byte(`{"title":" ","summary":"Details","category":"Community","status":"tba"}`)
	request := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewReader(body))
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	if response.Code != http.StatusBadRequest {
		t.Fatalf("invalid input status = %d, want %d", response.Code, http.StatusBadRequest)
	}
	if stories := store.List(); len(stories) != 0 {
		t.Fatalf("invalid request stored %d stories", len(stories))
	}
}
