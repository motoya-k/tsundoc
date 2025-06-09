package book

import (
	"context"
	"fmt"
	"strings"

	"github.com/motoya-k/tsundoc/internal/domain/ai"
	"github.com/motoya-k/tsundoc/internal/domain/book"
)

type UseCase struct {
	bookRepo  book.Repository
	aiService ai.Service
}

func NewUseCase(bookRepo book.Repository, aiService ai.Service) *UseCase {
	return &UseCase{
		bookRepo:  bookRepo,
		aiService: aiService,
	}
}

func (uc *UseCase) SaveBook(ctx context.Context, userID, title, author, description, content, url string, tags []string) (*book.Book, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	if content == "" {
		return nil, fmt.Errorf("content is required")
	}

	b := book.NewBook(userID, content)
	
	// Generate title using AI if not provided
	if title == "" {
		if uc.aiService != nil {
			generatedTitle, err := uc.aiService.GenerateTitle(ctx, content)
			if err != nil {
				// Log error but don't fail the operation
				fmt.Printf("Warning: failed to generate title: %v\n", err)
				title = "Untitled"
			} else {
				title = generatedTitle
			}
		} else {
			title = "Untitled"
		}
	}
	
	// Generate tags using AI if not provided
	if len(tags) == 0 {
		if uc.aiService != nil {
			generatedTags, err := uc.aiService.GenerateTags(ctx, content)
			if err != nil {
				// Log error but don't fail the operation
				fmt.Printf("Warning: failed to generate tags: %v\n", err)
			} else {
				tags = generatedTags
			}
		}
	}

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

func (uc *UseCase) MergeBooks(ctx context.Context, userID string, bookIDs []string) (*book.Book, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	if len(bookIDs) < 2 {
		return nil, fmt.Errorf("at least 2 books are required for merging")
	}

	// Fetch all books to merge
	var booksToMerge []*book.Book
	var contents []string
	var allTags []string
	
	for _, bookID := range bookIDs {
		b, err := uc.bookRepo.FindByID(ctx, bookID, userID)
		if err != nil {
			return nil, fmt.Errorf("failed to find book %s: %w", bookID, err)
		}
		booksToMerge = append(booksToMerge, b)
		contents = append(contents, b.Content)
		allTags = append(allTags, b.Tags...)
	}

	// Merge contents using AI
	var mergedContent string
	if uc.aiService != nil {
		content, err := uc.aiService.MergeContents(ctx, contents)
		if err != nil {
			// Fallback to simple concatenation
			fmt.Printf("Warning: failed to merge contents with AI: %v\n", err)
			mergedContent = strings.Join(contents, "\n\n---\n\n")
		} else {
			mergedContent = content
		}
	} else {
		mergedContent = strings.Join(contents, "\n\n---\n\n")
	}

	// Generate title for merged content
	var mergedTitle string
	if uc.aiService != nil {
		title, err := uc.aiService.GenerateTitle(ctx, mergedContent)
		if err != nil {
			fmt.Printf("Warning: failed to generate title for merged book: %v\n", err)
			mergedTitle = "Merged Book"
		} else {
			mergedTitle = title
		}
	} else {
		mergedTitle = "Merged Book"
	}

	// Deduplicate tags
	uniqueTags := make(map[string]bool)
	for _, tag := range allTags {
		if tag != "" {
			uniqueTags[tag] = true
		}
	}
	
	var finalTags []string
	for tag := range uniqueTags {
		finalTags = append(finalTags, tag)
	}

	// Create new merged book
	mergedBook := book.NewBook(userID, mergedContent)
	mergedBook.Title = mergedTitle
	mergedBook.Tags = finalTags

	if err := uc.bookRepo.Save(ctx, mergedBook); err != nil {
		return nil, fmt.Errorf("failed to save merged book: %w", err)
	}

	return mergedBook, nil
}