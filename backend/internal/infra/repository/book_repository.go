package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	
	"github.com/motoya-k/tsundoc/internal/domain/book"
	"github.com/motoya-k/tsundoc/internal/infra/database"
)

type BookRepository struct {
	pool    *pgxpool.Pool
	queries *database.Queries
}

func NewBookRepository(pool *pgxpool.Pool) book.Repository {
	return &BookRepository{
		pool:    pool,
		queries: database.New(pool),
	}
}

func (r *BookRepository) Save(ctx context.Context, b *book.Book) error {
	params := database.CreateBookParams{
		Title:       b.Title,
		Author:      pgtype.Text{String: b.Author, Valid: b.Author != ""},
		Description: pgtype.Text{String: b.Description, Valid: b.Description != ""},
		Tags:        b.Tags,
		Content:     pgtype.Text{String: b.Content, Valid: b.Content != ""},
		Url:         pgtype.Text{String: b.URL, Valid: b.URL != ""},
		UserID:      b.UserID,
	}

	result, err := r.queries.CreateBook(ctx, params)
	if err != nil {
		return fmt.Errorf("failed to create book: %w", err)
	}

	b.ID = uuid.UUID(result.ID.Bytes).String()
	b.CreatedAt = result.CreatedAt.Time
	b.UpdatedAt = result.UpdatedAt.Time
	return nil
}

func (r *BookRepository) FindByID(ctx context.Context, id, userID string) (*book.Book, error) {
	bookID, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("invalid book ID: %w", err)
	}

	var pgxUUID pgtype.UUID
	pgxUUID.Bytes = bookID
	pgxUUID.Valid = true

	row, err := r.queries.GetBook(ctx, database.GetBookParams{
		ID:     pgxUUID,
		UserID: userID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get book: %w", err)
	}

	return r.mapToBookDomain(row), nil
}

func (r *BookRepository) FindByUserID(ctx context.Context, userID string, keyword string) ([]*book.Book, error) {
	var rows []database.Book
	var err error

	if keyword == "" {
		rows, err = r.queries.GetBooksByUser(ctx, userID)
	} else {
		rows, err = r.queries.SearchBooks(ctx, database.SearchBooksParams{
			UserID: userID,
			Column2: pgtype.Text{String: keyword, Valid: true},
		})
	}

	if err != nil {
		return nil, fmt.Errorf("failed to get books: %w", err)
	}

	books := make([]*book.Book, len(rows))
	for i, row := range rows {
		books[i] = r.mapToBookDomain(row)
	}

	return books, nil
}

func (r *BookRepository) Update(ctx context.Context, b *book.Book) error {
	bookID, err := uuid.Parse(b.ID)
	if err != nil {
		return fmt.Errorf("invalid book ID: %w", err)
	}

	var pgxUUID pgtype.UUID
	pgxUUID.Bytes = bookID
	pgxUUID.Valid = true

	params := database.UpdateBookParams{
		ID:          pgxUUID,
		Title:       b.Title,
		Author:      pgtype.Text{String: b.Author, Valid: b.Author != ""},
		Description: pgtype.Text{String: b.Description, Valid: b.Description != ""},
		Tags:        b.Tags,
		Content:     pgtype.Text{String: b.Content, Valid: b.Content != ""},
		Url:         pgtype.Text{String: b.URL, Valid: b.URL != ""},
		UserID:      b.UserID,
	}

	result, err := r.queries.UpdateBook(ctx, params)
	if err != nil {
		return fmt.Errorf("failed to update book: %w", err)
	}

	b.UpdatedAt = result.UpdatedAt.Time
	return nil
}

func (r *BookRepository) Delete(ctx context.Context, id, userID string) error {
	bookID, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("invalid book ID: %w", err)
	}

	var pgxUUID pgtype.UUID
	pgxUUID.Bytes = bookID
	pgxUUID.Valid = true

	err = r.queries.DeleteBook(ctx, database.DeleteBookParams{
		ID:     pgxUUID,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("failed to delete book: %w", err)
	}

	return nil
}

func (r *BookRepository) mapToBookDomain(row database.Book) *book.Book {
	return &book.Book{
		ID:          uuid.UUID(row.ID.Bytes).String(),
		Title:       row.Title,
		Author:      row.Author.String,
		Description: row.Description.String,
		Tags:        row.Tags,
		Content:     row.Content.String,
		URL:         row.Url.String,
		UserID:      row.UserID,
		CreatedAt:   row.CreatedAt.Time,
		UpdatedAt:   row.UpdatedAt.Time,
	}
}