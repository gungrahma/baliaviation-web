package newsapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

var ErrNotFound = errors.New("news update not found")

type Story struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Summary   string    `json:"summary"`
	Category  string    `json:"category"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

type StoryInput struct {
	Title    string `json:"title"`
	Summary  string `json:"summary"`
	Category string `json:"category"`
	Status   string `json:"status"`
}

type StatusInput struct {
	Status string `json:"status"`
}

type ValidationError struct {
	message string
}

func (e *ValidationError) Error() string {
	return e.message
}

type Store struct {
	mu      sync.RWMutex
	path    string
	stories []Story
}

func NewStore(path string) (*Store, error) {
	store := &Store{path: path, stories: []Story{}}
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return store, nil
	}
	if err != nil {
		return nil, fmt.Errorf("read news store: %w", err)
	}
	if err := json.Unmarshal(data, &store.stories); err != nil {
		return nil, fmt.Errorf("decode news store: %w", err)
	}
	if store.stories == nil {
		store.stories = []Story{}
	}
	return store, nil
}

func (s *Store) List() []Story {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]Story{}, s.stories...)
}

func (s *Store) Create(input StoryInput) (Story, error) {
	input.Title = strings.TrimSpace(input.Title)
	input.Summary = strings.TrimSpace(input.Summary)
	if input.Title == "" || len([]rune(input.Title)) > 100 {
		return Story{}, &ValidationError{message: "Headline is required and must be 100 characters or fewer."}
	}
	if input.Summary == "" || len([]rune(input.Summary)) > 500 {
		return Story{}, &ValidationError{message: "Details are required and must be 500 characters or fewer."}
	}
	if !validCategory(input.Category) {
		return Story{}, &ValidationError{message: "Choose a valid news category."}
	}
	if input.Status != "tba" && input.Status != "announced" {
		return Story{}, &ValidationError{message: "Status must be tba or announced."}
	}

	id, err := newID()
	if err != nil {
		return Story{}, err
	}
	story := Story{
		ID:        id,
		Title:     input.Title,
		Summary:   input.Summary,
		Category:  input.Category,
		Status:    input.Status,
		CreatedAt: time.Now().UTC(),
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.stories = append([]Story{story}, s.stories...)
	if err := s.persist(); err != nil {
		s.stories = s.stories[1:]
		return Story{}, err
	}
	return story, nil
}

func (s *Store) SetStatus(id, status string) (Story, error) {
	if status != "tba" && status != "announced" {
		return Story{}, &ValidationError{message: "Status must be tba or announced."}
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.stories {
		if s.stories[index].ID != id {
			continue
		}
		previous := s.stories[index].Status
		s.stories[index].Status = status
		if err := s.persist(); err != nil {
			s.stories[index].Status = previous
			return Story{}, err
		}
		return s.stories[index], nil
	}
	return Story{}, ErrNotFound
}

func (s *Store) persist() error {
	data, err := json.MarshalIndent(s.stories, "", "  ")
	if err != nil {
		return fmt.Errorf("encode news store: %w", err)
	}
	directory := filepath.Dir(s.path)
	if err := os.MkdirAll(directory, 0o750); err != nil {
		return fmt.Errorf("create news store directory: %w", err)
	}
	temp, err := os.CreateTemp(directory, ".news-*.tmp")
	if err != nil {
		return fmt.Errorf("create temporary news store: %w", err)
	}
	tempName := temp.Name()
	defer os.Remove(tempName)
	if err := temp.Chmod(0o600); err != nil {
		temp.Close()
		return fmt.Errorf("secure temporary news store: %w", err)
	}
	if _, err := temp.Write(data); err != nil {
		temp.Close()
		return fmt.Errorf("write temporary news store: %w", err)
	}
	if err := temp.Sync(); err != nil {
		temp.Close()
		return fmt.Errorf("sync temporary news store: %w", err)
	}
	if err := temp.Close(); err != nil {
		return fmt.Errorf("close temporary news store: %w", err)
	}
	if err := os.Rename(tempName, s.path); err != nil {
		return fmt.Errorf("replace news store: %w", err)
	}
	return nil
}

func validCategory(category string) bool {
	switch category {
	case "Community", "Events", "Spotting", "Learning", "Industry":
		return true
	default:
		return false
	}
}
