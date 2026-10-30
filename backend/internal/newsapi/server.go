package newsapi

import (
	"crypto/subtle"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
)

type Server struct {
	store      *Store
	adminToken string
}

func NewHandler(store *Store, adminToken string) http.Handler {
	server := &Server{store: store, adminToken: adminToken}
	mux := http.NewServeMux()
	mux.HandleFunc("/api/news", server.handleCollection)
	mux.HandleFunc("/api/admin/session", server.handleAdminSession)
	return mux
}

func (s *Server) handleCollection(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		category := r.URL.Query().Get("category")
		if category != "" && !validCategory(category) {
			writeError(w, http.StatusBadRequest, "Choose a valid news category.")
			return
		}
		writeJSON(w, http.StatusOK, s.store.List(category))
	case http.MethodPost:
		if !s.authorized(w, r) {
			return
		}
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

func (s *Server) handleAdminSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", "GET")
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed.")
		return
	}
	w.Header().Set("Cache-Control", "no-store")
	if !s.authorized(w, r) {
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"authenticated": true})
}

func (s *Server) authorized(w http.ResponseWriter, r *http.Request) bool {
	if s.adminToken == "" {
		writeError(w, http.StatusServiceUnavailable, "News publishing is not configured.")
		return false
	}
	provided := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if provided == r.Header.Get("Authorization") || subtle.ConstantTimeCompare([]byte(provided), []byte(s.adminToken)) != 1 {
		writeError(w, http.StatusUnauthorized, "Admin access is required to publish news.")
		return false
	}
	return true
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
