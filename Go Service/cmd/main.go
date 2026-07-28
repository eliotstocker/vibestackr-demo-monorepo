package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/vibestackr/go-service/internal/handler"
	"github.com/vibestackr/go-service/internal/repository"
	"github.com/vibestackr/go-service/pkg/db"
)

func main() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL must be set")
	}

	database, err := db.NewPostgresDB(connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	repo := repository.NewPostgresRepository(database)
	h := handler.NewPersonHandler(repo)

	allowedOrigins := map[string]bool{
		"http://localhost:5173": true,
		"http://localhost:5174": true,
	}

	cors := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if allowedOrigins[origin] {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			}
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/persons", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			h.CreatePerson(w, r)
		case http.MethodGet:
			h.ListPersons(w, r)
		case http.MethodDelete:
			h.DeletePerson(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	go func() {
		time.Sleep(3 * time.Second)
		resp, err := http.Get("http://localhost:9999/counter")
		if err != nil {
			log.Printf("ERROR: failed to fetch counter from Java backend: %v", err)
			return
		}
		defer resp.Body.Close()
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Counter from Java backend: %s", body)
	}()

	fmt.Println("Server starting on :8080...")
	if err := http.ListenAndServe(":8080", cors(mux)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
