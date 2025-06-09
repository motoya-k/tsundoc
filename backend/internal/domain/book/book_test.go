package book

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestNewBook(t *testing.T) {
	userID := "user-123"
	content := "This is test content for a book"

	book := NewBook(userID, content)

	assert.NotEmpty(t, book.ID)
	assert.Equal(t, userID, book.UserID)
	assert.Equal(t, content, book.Content)
	assert.WithinDuration(t, time.Now(), book.CreatedAt, time.Second)
	assert.WithinDuration(t, time.Now(), book.UpdatedAt, time.Second)
	assert.Empty(t, book.Title)
	assert.Empty(t, book.Author)
	assert.Empty(t, book.Description)
	assert.Empty(t, book.URL)
	assert.Empty(t, book.Tags)
}

func TestBook_Validation(t *testing.T) {
	tests := []struct {
		name     string
		userID   string
		content  string
		expected bool
	}{
		{
			name:     "valid book",
			userID:   "user-123",
			content:  "Valid content",
			expected: true,
		},
		{
			name:     "empty user ID",
			userID:   "",
			content:  "Valid content",
			expected: false,
		},
		{
			name:     "empty content",
			userID:   "user-123",
			content:  "",
			expected: false,
		},
		{
			name:     "both empty",
			userID:   "",
			content:  "",
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			book := NewBook(tt.userID, tt.content)
			
			hasValidUserID := book.UserID != ""
			hasValidContent := book.Content != ""
			isValid := hasValidUserID && hasValidContent
			
			assert.Equal(t, tt.expected, isValid)
		})
	}
}

func TestBook_Tags(t *testing.T) {
	book := NewBook("user-123", "test content")
	
	// Test setting tags
	tags := []string{"technology", "programming", "go"}
	book.Tags = tags
	
	assert.Equal(t, tags, book.Tags)
	assert.Len(t, book.Tags, 3)
	assert.Contains(t, book.Tags, "technology")
	assert.Contains(t, book.Tags, "programming")
	assert.Contains(t, book.Tags, "go")
}

func TestBook_Fields(t *testing.T) {
	book := NewBook("user-123", "test content")
	
	// Test setting all fields
	book.Title = "Test Book"
	book.Author = "Test Author"
	book.Description = "Test Description"
	book.URL = "https://example.com"
	
	assert.Equal(t, "Test Book", book.Title)
	assert.Equal(t, "Test Author", book.Author)
	assert.Equal(t, "Test Description", book.Description)
	assert.Equal(t, "https://example.com", book.URL)
}