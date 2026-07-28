package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/vibestackr/go-service/internal/repository"
)

type PersonHandler struct {
	repo repository.PersonRepository
}

func NewPersonHandler(repo repository.PersonRepository) *PersonHandler {
	return &PersonHandler{repo: repo}
}

func (h *PersonHandler) CreatePerson(w http.ResponseWriter, r *http.Request) {
	var p repository.Person
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.Create(r.Context(), &p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (h *PersonHandler) ListPersons(w http.ResponseWriter, r *http.Request) {
	persons, err := h.repo.List(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(persons)
}

func (h *PersonHandler) DeletePerson(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.repo.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
