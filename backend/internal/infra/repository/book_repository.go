package repository

import (
	"context"
	"fmt"
	"strings"

	"gorm.io/gorm"
	
	"github.com/motoya-k/tsundoc/internal/domain/book"
	"github.com/motoya-k/tsundoc/internal/infra/database"
)

type BookRepository struct {
	db *database.DB
}

func NewBookRepository(db *database.DB) book.Repository {
	return &BookRepository{
		db: db,
	}
}

func (r *BookRepository) Save(ctx context.Context, b *book.Book) error {
	dbBook := &database.Book{
		Title:   b.Title,
		Content: b.Content,
		Tags:    b.Tags,
		UserID:  b.UserID,
	}

	if err := r.db.WithContext(ctx).Create(dbBook).Error; err != nil {
		return fmt.Errorf("failed to create book: %w", err)
	}

	b.ID = dbBook.ID
	b.CreatedAt = dbBook.CreatedAt
	b.UpdatedAt = dbBook.UpdatedAt
	return nil
}

func (r *BookRepository) FindByID(ctx context.Context, id, userID string) (*book.Book, error) {
	var dbBook database.Book
	err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&dbBook).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("book not found")
		}
		return nil, fmt.Errorf("failed to get book: %w", err)
	}

	return r.mapToBookDomain(&dbBook), nil
}

func (r *BookRepository) FindByUserID(ctx context.Context, userID string, keyword string) ([]*book.Book, error) {
	var dbBooks []database.Book
	query := r.db.WithContext(ctx).Where("user_id = ?", userID)

	if keyword != "" {
		// Search in title, content, and tags
		keyword = strings.ToLower(keyword)
		query = query.Where(
			"LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR EXISTS (SELECT 1 FROM unnest(tags) AS tag WHERE LOWER(tag) LIKE ?)",
			"%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%",
		)
	}

	if err := query.Order("created_at DESC").Find(&dbBooks).Error; err != nil {
		return nil, fmt.Errorf("failed to get books: %w", err)
	}

	books := make([]*book.Book, len(dbBooks))
	for i, dbBook := range dbBooks {
		books[i] = r.mapToBookDomain(&dbBook)
	}

	return books, nil
}

func (r *BookRepository) Update(ctx context.Context, b *book.Book) error {
	dbBook := &database.Book{
		ID:      b.ID,
		Title:   b.Title,
		Content: b.Content,
		Tags:    b.Tags,
		UserID:  b.UserID,
	}

	result := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", b.ID, b.UserID).Updates(dbBook)
	if result.Error != nil {
		return fmt.Errorf("failed to update book: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("book not found or not authorized")
	}

	// Fetch updated book to get the new UpdatedAt time
	var updatedBook database.Book
	if err := r.db.WithContext(ctx).Where("id = ?", b.ID).First(&updatedBook).Error; err != nil {
		return fmt.Errorf("failed to fetch updated book: %w", err)
	}

	b.UpdatedAt = updatedBook.UpdatedAt
	return nil
}

func (r *BookRepository) Delete(ctx context.Context, id, userID string) error {
	result := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&database.Book{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete book: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("book not found or not authorized")
	}

	return nil
}

func (r *BookRepository) mapToBookDomain(dbBook *database.Book) *book.Book {
	return &book.Book{
		ID:        dbBook.ID,
		Title:     dbBook.Title,
		Content:   dbBook.Content,
		Tags:      dbBook.Tags,
		UserID:    dbBook.UserID,
		CreatedAt: dbBook.CreatedAt,
		UpdatedAt: dbBook.UpdatedAt,
	}
}