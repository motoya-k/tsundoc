package repository

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/motoya-k/tsundoc/internal/domain/book"
	"github.com/motoya-k/tsundoc/internal/infra/database"
)

func setupTestDB(t *testing.T) *database.DB {
	gormDB, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	
	// Auto migrate
	err = gormDB.AutoMigrate(&database.Book{})
	require.NoError(t, err)
	
	return &database.DB{DB: gormDB}
}

func TestBookRepository_Save(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	book := book.NewBook("user-123", "Test content")
	book.Title = "Test Book"
	book.Tags = []string{"test", "book"}

	err := repo.Save(ctx, book)
	require.NoError(t, err)

	// Verify the book was saved
	var savedBook database.Book
	err = db.DB.First(&savedBook, "id = ?", book.ID).Error
	require.NoError(t, err)

	assert.Equal(t, book.ID, savedBook.ID)
	assert.Equal(t, book.UserID, savedBook.UserID)
	assert.Equal(t, book.Title, savedBook.Title)
	assert.Equal(t, book.Content, savedBook.Content)
	assert.Equal(t, book.Tags, savedBook.Tags)
}

func TestBookRepository_FindByID(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	// Create and save a book
	originalBook := book.NewBook("user-123", "Test content")
	originalBook.Title = "Test Book"
	originalBook.Tags = []string{"test", "book"}
	
	err := repo.Save(ctx, originalBook)
	require.NoError(t, err)

	// Test finding the book
	foundBook, err := repo.FindByID(ctx, originalBook.ID, originalBook.UserID)
	require.NoError(t, err)
	require.NotNil(t, foundBook)

	assert.Equal(t, originalBook.ID, foundBook.ID)
	assert.Equal(t, originalBook.UserID, foundBook.UserID)
	assert.Equal(t, originalBook.Title, foundBook.Title)
	assert.Equal(t, originalBook.Content, foundBook.Content)
	assert.Equal(t, originalBook.Tags, foundBook.Tags)
}

func TestBookRepository_FindByID_NotFound(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	_, err := repo.FindByID(ctx, "non-existent-id", "user-123")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "book not found")
}

func TestBookRepository_FindByID_WrongUser(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	// Create and save a book for user-123
	originalBook := book.NewBook("user-123", "Test content")
	err := repo.Save(ctx, originalBook)
	require.NoError(t, err)

	// Try to find it with a different user ID
	_, err = repo.FindByID(ctx, originalBook.ID, "user-456")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "book not found")
}

func TestBookRepository_FindByUserID(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	userID := "user-123"

	// Create and save multiple books
	book1 := book.NewBook(userID, "Content 1")
	book1.Title = "Book 1"
	book1.Tags = []string{"tag1", "common"}

	book2 := book.NewBook(userID, "Content 2")
	book2.Title = "Book 2"
	book2.Tags = []string{"tag2", "common"}

	book3 := book.NewBook("user-456", "Content 3") // Different user
	book3.Title = "Book 3"

	err := repo.Save(ctx, book1)
	require.NoError(t, err)
	err = repo.Save(ctx, book2)
	require.NoError(t, err)
	err = repo.Save(ctx, book3)
	require.NoError(t, err)

	// Test finding books by user ID
	books, err := repo.FindByUserID(ctx, userID, "")
	require.NoError(t, err)
	assert.Len(t, books, 2)

	// Verify the books belong to the correct user
	for _, b := range books {
		assert.Equal(t, userID, b.UserID)
	}
}

func TestBookRepository_FindByUserID_WithKeyword(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	userID := "user-123"

	// Create and save books with different content
	book1 := book.NewBook(userID, "GraphQL is a query language")
	book1.Title = "GraphQL Guide"
	book1.Tags = []string{"graphql", "api"}

	book2 := book.NewBook(userID, "REST API design patterns")
	book2.Title = "REST Guide"
	book2.Tags = []string{"rest", "api"}

	book3 := book.NewBook(userID, "JavaScript programming")
	book3.Title = "JS Guide"
	book3.Tags = []string{"javascript", "programming"}

	err := repo.Save(ctx, book1)
	require.NoError(t, err)
	err = repo.Save(ctx, book2)
	require.NoError(t, err)
	err = repo.Save(ctx, book3)
	require.NoError(t, err)

	tests := []struct {
		name            string
		keyword         string
		expectedCount   int
		expectedTitles  []string
	}{
		{
			name:           "search by title",
			keyword:        "GraphQL",
			expectedCount:  1,
			expectedTitles: []string{"GraphQL Guide"},
		},
		{
			name:           "search by content",
			keyword:        "query",
			expectedCount:  1,
			expectedTitles: []string{"GraphQL Guide"},
		},
		{
			name:           "search by tag",
			keyword:        "api",
			expectedCount:  2,
			expectedTitles: []string{"GraphQL Guide", "REST Guide"},
		},
		{
			name:           "case insensitive search",
			keyword:        "javascript",
			expectedCount:  1,
			expectedTitles: []string{"JS Guide"},
		},
		{
			name:          "no matches",
			keyword:       "python",
			expectedCount: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			books, err := repo.FindByUserID(ctx, userID, tt.keyword)
			require.NoError(t, err)
			assert.Len(t, books, tt.expectedCount)

			if tt.expectedCount > 0 {
				var actualTitles []string
				for _, b := range books {
					actualTitles = append(actualTitles, b.Title)
				}
				assert.ElementsMatch(t, tt.expectedTitles, actualTitles)
			}
		})
	}
}

func TestBookRepository_Update(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	// Create and save a book
	book := book.NewBook("user-123", "Original content")
	book.Title = "Original Title"
	book.Tags = []string{"original"}

	err := repo.Save(ctx, book)
	require.NoError(t, err)

	// Update the book
	book.Title = "Updated Title"
	book.Content = "Updated content"
	book.Tags = []string{"updated", "modified"}

	err = repo.Update(ctx, book)
	require.NoError(t, err)

	// Verify the update
	updatedBook, err := repo.FindByID(ctx, book.ID, book.UserID)
	require.NoError(t, err)

	assert.Equal(t, "Updated Title", updatedBook.Title)
	assert.Equal(t, "Updated content", updatedBook.Content)
	assert.Equal(t, []string{"updated", "modified"}, updatedBook.Tags)
}

func TestBookRepository_Delete(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	// Create and save a book
	book := book.NewBook("user-123", "Test content")
	err := repo.Save(ctx, book)
	require.NoError(t, err)

	// Verify it exists
	_, err = repo.FindByID(ctx, book.ID, book.UserID)
	require.NoError(t, err)

	// Delete the book
	err = repo.Delete(ctx, book.ID, book.UserID)
	require.NoError(t, err)

	// Verify it's deleted (soft delete, so record exists but is marked as deleted)
	_, err = repo.FindByID(ctx, book.ID, book.UserID)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "book not found")
}

func TestBookRepository_Delete_WrongUser(t *testing.T) {
	db := setupTestDB(t)
	repo := NewBookRepository(db)
	ctx := context.Background()

	// Create and save a book for user-123
	book := book.NewBook("user-123", "Test content")
	err := repo.Save(ctx, book)
	require.NoError(t, err)

	// Try to delete it with a different user ID
	err = repo.Delete(ctx, book.ID, "user-456")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "book not found")

	// Verify the book still exists for the original user
	_, err = repo.FindByID(ctx, book.ID, "user-123")
	require.NoError(t, err)
}