package book

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Book represents a book entity in the domain
type Book struct {
	ID          string
	Title       string
	Author      string
	Description string
	Tags        []string
	Content     string
	URL         string
	UserID      string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// NewBook creates a new book instance
func NewBook(userID, content string) *Book {
	now := time.Now()
	return &Book{
		ID:        uuid.New().String(),
		UserID:    userID,
		Content:   content,
		Tags:      []string{},
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// Repository defines the interface for book persistence
type Repository interface {
	Save(ctx context.Context, book *Book) error
	FindByID(ctx context.Context, id, userID string) (*Book, error)
	FindByUserID(ctx context.Context, userID string, keyword string) ([]*Book, error)
	Update(ctx context.Context, book *Book) error
	Delete(ctx context.Context, id, userID string) error
}