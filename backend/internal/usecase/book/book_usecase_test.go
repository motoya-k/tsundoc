package book

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/motoya-k/tsundoc/internal/domain/book"
)

// MockRepository implements book.Repository for testing
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Save(ctx context.Context, b *book.Book) error {
	args := m.Called(ctx, b)
	return args.Error(0)
}

func (m *MockRepository) FindByID(ctx context.Context, id, userID string) (*book.Book, error) {
	args := m.Called(ctx, id, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*book.Book), args.Error(1)
}

func (m *MockRepository) FindByUserID(ctx context.Context, userID, keyword string) ([]*book.Book, error) {
	args := m.Called(ctx, userID, keyword)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*book.Book), args.Error(1)
}

func (m *MockRepository) Update(ctx context.Context, b *book.Book) error {
	args := m.Called(ctx, b)
	return args.Error(0)
}

func (m *MockRepository) Delete(ctx context.Context, id, userID string) error {
	args := m.Called(ctx, id, userID)
	return args.Error(0)
}

// MockAIService implements ai.Service for testing
type MockAIService struct {
	mock.Mock
}

func (m *MockAIService) GenerateTitle(ctx context.Context, content string) (string, error) {
	args := m.Called(ctx, content)
	return args.String(0), args.Error(1)
}

func (m *MockAIService) GenerateTags(ctx context.Context, content string) ([]string, error) {
	args := m.Called(ctx, content)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]string), args.Error(1)
}

func (m *MockAIService) SummarizeContent(ctx context.Context, content string) (string, error) {
	args := m.Called(ctx, content)
	return args.String(0), args.Error(1)
}

func (m *MockAIService) MergeContents(ctx context.Context, contents []string) (string, error) {
	args := m.Called(ctx, contents)
	return args.String(0), args.Error(1)
}

func TestUseCase_SaveBook(t *testing.T) {
	ctx := context.Background()
	mockRepo := new(MockRepository)
	mockAI := new(MockAIService)
	uc := NewUseCase(mockRepo, mockAI)

	t.Run("save book with AI generation", func(t *testing.T) {
		userID := "user-123"
		content := "This is about GraphQL APIs and how to build them effectively."
		
		// Mock AI responses
		mockAI.On("GenerateTitle", ctx, content).Return("GraphQL API Guide", nil)
		mockAI.On("GenerateTags", ctx, content).Return([]string{"GraphQL", "API", "Tutorial"}, nil)
		
		// Mock repository save
		mockRepo.On("Save", ctx, mock.AnythingOfType("*book.Book")).Return(nil)

		result, err := uc.SaveBook(ctx, userID, "", "", "", content, "", nil)

		require.NoError(t, err)
		assert.Equal(t, "GraphQL API Guide", result.Title)
		assert.Equal(t, []string{"GraphQL", "API", "Tutorial"}, result.Tags)
		assert.Equal(t, content, result.Content)
		assert.Equal(t, userID, result.UserID)

		mockRepo.AssertExpectations(t)
		mockAI.AssertExpectations(t)
	})

	t.Run("save book with provided title and tags", func(t *testing.T) {
		userID := "user-123"
		title := "Custom Title"
		tags := []string{"custom", "tag"}
		content := "Some content"
		
		// Mock repository save - AI should not be called
		mockRepo.On("Save", ctx, mock.AnythingOfType("*book.Book")).Return(nil)

		result, err := uc.SaveBook(ctx, userID, title, "", "", content, "", tags)

		require.NoError(t, err)
		assert.Equal(t, title, result.Title)
		assert.Equal(t, tags, result.Tags)
		assert.Equal(t, content, result.Content)

		mockRepo.AssertExpectations(t)
		// AI service should not have been called
		mockAI.AssertNotCalled(t, "GenerateTitle")
		mockAI.AssertNotCalled(t, "GenerateTags")
	})

	t.Run("error when userID is empty", func(t *testing.T) {
		_, err := uc.SaveBook(ctx, "", "title", "", "", "content", "", nil)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user ID is required")
	})

	t.Run("error when content is empty", func(t *testing.T) {
		_, err := uc.SaveBook(ctx, "user-123", "title", "", "", "", "", nil)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "content is required")
	})

	t.Run("AI generation error should not fail save", func(t *testing.T) {
		userID := "user-123"
		content := "Some content"
		
		// Mock AI failures
		mockAI.On("GenerateTitle", ctx, content).Return("", errors.New("AI error"))
		mockAI.On("GenerateTags", ctx, content).Return([]string(nil), errors.New("AI error"))
		
		// Mock repository save
		mockRepo.On("Save", ctx, mock.AnythingOfType("*book.Book")).Return(nil)

		result, err := uc.SaveBook(ctx, userID, "", "", "", content, "", nil)

		require.NoError(t, err)
		assert.Equal(t, "Untitled", result.Title)
		assert.Empty(t, result.Tags)

		mockRepo.AssertExpectations(t)
		mockAI.AssertExpectations(t)
	})
}

func TestUseCase_GetBook(t *testing.T) {
	ctx := context.Background()
	mockRepo := new(MockRepository)
	mockAI := new(MockAIService)
	uc := NewUseCase(mockRepo, mockAI)

	t.Run("get book successfully", func(t *testing.T) {
		bookID := "book-123"
		userID := "user-123"
		expectedBook := &book.Book{
			ID:      bookID,
			UserID:  userID,
			Title:   "Test Book",
			Content: "Test content",
		}

		mockRepo.On("FindByID", ctx, bookID, userID).Return(expectedBook, nil)

		result, err := uc.GetBook(ctx, bookID, userID)

		require.NoError(t, err)
		assert.Equal(t, expectedBook, result)
		mockRepo.AssertExpectations(t)
	})

	t.Run("error when book ID is empty", func(t *testing.T) {
		_, err := uc.GetBook(ctx, "", "user-123")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "book ID is required")
	})

	t.Run("error when user ID is empty", func(t *testing.T) {
		_, err := uc.GetBook(ctx, "book-123", "")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user ID is required")
	})
}

func TestUseCase_GetMyBooks(t *testing.T) {
	ctx := context.Background()
	mockRepo := new(MockRepository)
	mockAI := new(MockAIService)
	uc := NewUseCase(mockRepo, mockAI)

	t.Run("get books successfully", func(t *testing.T) {
		userID := "user-123"
		keyword := "test"
		expectedBooks := []*book.Book{
			{ID: "1", UserID: userID, Title: "Book 1"},
			{ID: "2", UserID: userID, Title: "Book 2"},
		}

		mockRepo.On("FindByUserID", ctx, userID, keyword).Return(expectedBooks, nil)

		result, err := uc.GetMyBooks(ctx, userID, keyword)

		require.NoError(t, err)
		assert.Equal(t, expectedBooks, result)
		mockRepo.AssertExpectations(t)
	})

	t.Run("error when user ID is empty", func(t *testing.T) {
		_, err := uc.GetMyBooks(ctx, "", "keyword")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user ID is required")
	})
}

func TestUseCase_UpdateBook(t *testing.T) {
	ctx := context.Background()
	mockRepo := new(MockRepository)
	mockAI := new(MockAIService)
	uc := NewUseCase(mockRepo, mockAI)

	t.Run("update book successfully", func(t *testing.T) {
		bookID := "book-123"
		userID := "user-123"
		originalBook := &book.Book{
			ID:      bookID,
			UserID:  userID,
			Title:   "Original Title",
			Content: "Original content",
		}

		mockRepo.On("FindByID", ctx, bookID, userID).Return(originalBook, nil)
		mockRepo.On("Update", ctx, mock.AnythingOfType("*book.Book")).Return(nil)

		result, err := uc.UpdateBook(ctx, bookID, userID, "New Title", "Author", "Description", "New content", "URL", []string{"tag1", "tag2"})

		require.NoError(t, err)
		assert.Equal(t, "New Title", result.Title)
		assert.Equal(t, "New content", result.Content)
		assert.Equal(t, []string{"tag1", "tag2"}, result.Tags)
		mockRepo.AssertExpectations(t)
	})

	t.Run("error when book ID is empty", func(t *testing.T) {
		_, err := uc.UpdateBook(ctx, "", "user-123", "title", "", "", "content", "", nil)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "book ID is required")
	})
}

func TestUseCase_DeleteBook(t *testing.T) {
	ctx := context.Background()
	mockRepo := new(MockRepository)
	mockAI := new(MockAIService)
	uc := NewUseCase(mockRepo, mockAI)

	t.Run("delete book successfully", func(t *testing.T) {
		bookID := "book-123"
		userID := "user-123"

		mockRepo.On("Delete", ctx, bookID, userID).Return(nil)

		err := uc.DeleteBook(ctx, bookID, userID)

		require.NoError(t, err)
		mockRepo.AssertExpectations(t)
	})

	t.Run("error when book ID is empty", func(t *testing.T) {
		err := uc.DeleteBook(ctx, "", "user-123")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "book ID is required")
	})
}

func TestUseCase_MergeBooks(t *testing.T) {
	ctx := context.Background()

	t.Run("merge books successfully", func(t *testing.T) {
		mockRepo := new(MockRepository)
		mockAI := new(MockAIService)
		uc := NewUseCase(mockRepo, mockAI)
		userID := "user-123"
		bookIDs := []string{"book-1", "book-2"}
		
		book1 := &book.Book{
			ID:      "book-1",
			UserID:  userID,
			Title:   "Book 1",
			Content: "Content 1",
			Tags:    []string{"tag1", "tag2"},
		}
		
		book2 := &book.Book{
			ID:      "book-2",
			UserID:  userID,
			Title:   "Book 2",
			Content: "Content 2",
			Tags:    []string{"tag2", "tag3"},
		}

		mockRepo.On("FindByID", ctx, "book-1", userID).Return(book1, nil)
		mockRepo.On("FindByID", ctx, "book-2", userID).Return(book2, nil)
		mockAI.On("MergeContents", ctx, []string{"Content 1", "Content 2"}).Return("Merged Content", nil)
		mockAI.On("GenerateTitle", ctx, "Merged Content").Return("Merged Title", nil)
		mockRepo.On("Save", ctx, mock.AnythingOfType("*book.Book")).Return(nil)

		result, err := uc.MergeBooks(ctx, userID, bookIDs)

		require.NoError(t, err)
		assert.Equal(t, "Merged Title", result.Title)
		assert.Equal(t, "Merged Content", result.Content)
		assert.Contains(t, result.Tags, "tag1")
		assert.Contains(t, result.Tags, "tag2")
		assert.Contains(t, result.Tags, "tag3")
		assert.Len(t, result.Tags, 3) // Deduplicated tags

		mockRepo.AssertExpectations(t)
		mockAI.AssertExpectations(t)
	})

	t.Run("error when user ID is empty", func(t *testing.T) {
		mockRepo := new(MockRepository)
		mockAI := new(MockAIService)
		uc := NewUseCase(mockRepo, mockAI)
		
		_, err := uc.MergeBooks(ctx, "", []string{"book-1", "book-2"})
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user ID is required")
	})

	t.Run("error when less than 2 books", func(t *testing.T) {
		mockRepo := new(MockRepository)
		mockAI := new(MockAIService)
		uc := NewUseCase(mockRepo, mockAI)
		
		_, err := uc.MergeBooks(ctx, "user-123", []string{"book-1"})
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "at least 2 books are required for merging")
	})

	t.Run("merge with AI failure fallback", func(t *testing.T) {
		mockRepo := new(MockRepository)
		mockAI := new(MockAIService)
		uc := NewUseCase(mockRepo, mockAI)
		userID := "user-123"
		bookIDs := []string{"book-1", "book-2"}
		
		book1 := &book.Book{
			ID:      "book-1",
			UserID:  userID,
			Content: "Content 1",
		}
		
		book2 := &book.Book{
			ID:      "book-2",
			UserID:  userID,
			Content: "Content 2",
		}

		mockRepo.On("FindByID", ctx, "book-1", userID).Return(book1, nil)
		mockRepo.On("FindByID", ctx, "book-2", userID).Return(book2, nil)
		mockAI.On("MergeContents", ctx, []string{"Content 1", "Content 2"}).Return("", errors.New("AI error"))
		mockAI.On("GenerateTitle", ctx, mock.AnythingOfType("string")).Return("", errors.New("AI error"))
		mockRepo.On("Save", ctx, mock.AnythingOfType("*book.Book")).Return(nil)

		result, err := uc.MergeBooks(ctx, userID, bookIDs)

		require.NoError(t, err)
		assert.Equal(t, "Merged Book", result.Title)
		// When AI fails, it should fall back to simple concatenation
		expectedContent := "Content 1\n\n---\n\nContent 2"
		assert.Equal(t, expectedContent, result.Content)

		mockRepo.AssertExpectations(t)
		mockAI.AssertExpectations(t)
	})
}