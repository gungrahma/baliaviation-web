package newsapi

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
)

type Server struct {
	store *Store
}

func NewHandler(store *Store) http.Handler {
	server := &Server{store: store}
	mux := http.NewServeMux()
	mux.HandleFunc("/api/news", server.handleCollection)
	mux.HandleFunc("/api/news/", server.handleStory)
	return mux
}

func (s *Server) handleCollection(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.List())
	case http.MethodPost:
		var input StoryInput
		if err := decodeJSON(w, r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "Request body must be valid JSON.")
			return
		}
		story, err := s.store.Create(input)
		if err != nil {
			var validationError *ValidationError
			if errors.As(err, &validationError) {
				writeError(w, http.StatusBadRequest, validationError.Error())
				return
			}
			writeError(w, http.StatusInternalServerError, "Could not save this update.")
			return
		}
		writeJSON(w, http.StatusCreated, story)
	default:
		w.Header().Set("Allow", "GET, POST")
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed.")
	}
}

func (s *Server) handleStory(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/news/")
	if id == "" || strings.Contains(id, "/") {
		writeError(w, http.StatusNotFound, "Update not found.")
		return
	}
	if r.Method != http.MethodPatch {
		w.Header().Set("Allow", "PATCH")
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed.")
		return
	}

	var input StatusInput
	if err := decodeJSON(w, r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "Request body must be valid JSON.")
		return
	}
	story, err := s.store.SetStatus(id, input.Status)
	if errors.Is(err, ErrNotFound) {
		writeError(w, http.StatusNotFound, "Update not found.")
		return
	}
	if err != nil {
		var validationError *ValidationError
		if errors.As(err, &validationError) {
			writeError(w, http.StatusBadRequest, validationError.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, "Could not save this update.")
		return
	}
	writeJSON(w, http.StatusOK, story)
}

func decodeJSON(w http.ResponseWriter, r *http.Request, destination any) error {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(destination); err != nil {
		return err
	}
	if err := decoder.Decode(new(any)); !errors.Is(err, io.EOF) {
		return errors.New("request must contain exactly one JSON value")
	}
	return nil
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
