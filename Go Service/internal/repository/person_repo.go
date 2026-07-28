package repository

import (
	"context"
	"database/sql"
)

type Person struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type PersonRepository interface {
	Create(ctx context.Context, person *Person) error
	List(ctx context.Context) ([]Person, error)
	Delete(ctx context.Context, id int) error
}

type postgresRepo struct {
	db *sql.DB
}

func NewPostgresRepository(db *sql.DB) PersonRepository {
	return &postgresRepo{db: db}
}

func (r *postgresRepo) Create(ctx context.Context, p *Person) error {
	query := `INSERT INTO persons (first_name, last_name) VALUES ($1, $2) RETURNING id`
	return r.db.QueryRowContext(ctx, query, p.FirstName, p.LastName).Scan(&p.ID)
}

func (r *postgresRepo) List(ctx context.Context) ([]Person, error) {
	query := `SELECT id, first_name, last_name FROM persons`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var persons []Person
	for rows.Next() {
		var p Person
		if err := rows.Scan(&p.ID, &p.FirstName, &p.LastName); err != nil {
			return nil, err
		}
		persons = append(persons, p)
	}
	return persons, nil
}

func (r *postgresRepo) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM persons WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
