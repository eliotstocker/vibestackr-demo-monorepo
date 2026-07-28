package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	fmt.Println("Server starting on :8080...")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
