package book

import (
	"context"
	"fmt"

	"github.com/motoya-k/tsundoc/internal/domain/book"
)

type UseCase struct {
	bookRepo book.Repository
}

func NewUseCase(bookRepo book.Repository) *UseCase {
	return &UseCase{
		bookRepo: bookRepo,
	}
}

func (uc *UseCase) SaveBook(ctx context.Context, userID, title, author, description, content, url string, tags []string) (*book.Book, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	b := book.NewBook(userID, content)
	b.Title = title
	b.Author = author
	b.Description = description
	b.URL = url
	b.Tags = tags

	if err := uc.bookRepo.Save(ctx, b); err != nil {
		return nil, fmt.Errorf("failed to save book: %w", err)
	}

	return b, nil
}

func (uc *UseCase) GetBook(ctx context.Context, id, userID string) (*book.Book, error) {
	if id == "" {
		return nil, fmt.Errorf("book ID is required")
	}
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	b, err := uc.bookRepo.FindByID(ctx, id, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get book: %w", err)
	}

	return b, nil
}

func (uc *UseCase) GetMyBooks(ctx context.Context, userID string, keyword string) ([]*book.Book, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	books, err := uc.bookRepo.FindByUserID(ctx, userID, keyword)
	if err != nil {
		return nil, fmt.Errorf("failed to get books: %w", err)
	}

	return books, nil
}

func (uc *UseCase) UpdateBook(ctx context.Context, id, userID, title, author, description, content, url string, tags []string) (*book.Book, error) {
	if id == "" {
		return nil, fmt.Errorf("book ID is required")
	}
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	b, err := uc.bookRepo.FindByID(ctx, id, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to find book: %w", err)
	}

	b.Title = title
	b.Author = author
	b.Description = description
	b.Content = content
	b.URL = url
	b.Tags = tags

	if err := uc.bookRepo.Update(ctx, b); err != nil {
		return nil, fmt.Errorf("failed to update book: %w", err)
	}

	return b, nil
}

func (uc *UseCase) DeleteBook(ctx context.Context, id, userID string) error {
	if id == "" {
		return fmt.Errorf("book ID is required")
	}
	if userID == "" {
		return fmt.Errorf("user ID is required")
	}

	if err := uc.bookRepo.Delete(ctx, id, userID); err != nil {
		return fmt.Errorf("failed to delete book: %w", err)
	}

	return nil
}