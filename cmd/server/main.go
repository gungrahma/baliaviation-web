package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"baliaviation/internal/newsapi"
)

func main() {
	dataFile := os.Getenv("NEWS_DATA_FILE")
	if dataFile == "" {
		dataFile = "data/news.json"
	}
	address := os.Getenv("NEWS_ADDR")
	if address == "" {
		address = "127.0.0.1:8080"
	}

	store, err := newsapi.NewStore(dataFile)
	if err != nil {
		log.Fatal(err)
	}
	server := &http.Server{
		Addr:              address,
		Handler:           newsapi.NewHandler(store),
		ReadHeaderTimeout: 5 * time.Second,
	}
	log.Printf("Bali Aviation news API listening on %s", address)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
