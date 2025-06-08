package book

import (
	"time"
)

// Book represents a book entity in the domain
type Book struct {
	ID        string
	Title     string
	Tags      []string
	Content   string
	UserID    string
	CreatedAt time.Time
	UpdatedAt time.Time
}

// NewBook creates a new book instance
func NewBook(userID, content string) *Book {
	now := time.Now()
	return &Book{
		UserID:    userID,
		Content:   content,
		Tags:      []string{},
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// Repository defines the interface for book persistence
type Repository interface {
	Save(book *Book) error
	FindByID(id string) (*Book, error)
	FindByUserID(userID string, keyword string) ([]*Book, error)
	Update(book *Book) error
	Delete(id string) error
}