package ai

import (
	"context"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// MockOpenAIService is a mock implementation for testing
type MockOpenAIService struct {
	GenerateTitleFunc      func(ctx context.Context, content string) (string, error)
	GenerateTagsFunc       func(ctx context.Context, content string) ([]string, error)
	SummarizeContentFunc   func(ctx context.Context, content string) (string, error)
	MergeContentsFunc      func(ctx context.Context, contents []string) (string, error)
}

func (m *MockOpenAIService) GenerateTitle(ctx context.Context, content string) (string, error) {
	if m.GenerateTitleFunc != nil {
		return m.GenerateTitleFunc(ctx, content)
	}
	return "Test Title", nil
}

func (m *MockOpenAIService) GenerateTags(ctx context.Context, content string) ([]string, error) {
	if m.GenerateTagsFunc != nil {
		return m.GenerateTagsFunc(ctx, content)
	}
	return []string{"test", "tag", "mock"}, nil
}

func (m *MockOpenAIService) SummarizeContent(ctx context.Context, content string) (string, error) {
	if m.SummarizeContentFunc != nil {
		return m.SummarizeContentFunc(ctx, content)
	}
	return "Test summary", nil
}

func (m *MockOpenAIService) MergeContents(ctx context.Context, contents []string) (string, error) {
	if m.MergeContentsFunc != nil {
		return m.MergeContentsFunc(ctx, contents)
	}
	return "Merged content", nil
}

func TestOpenAIService_GenerateTitle(t *testing.T) {
	// Skip if no API key is set
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		t.Skip("OPENAI_API_KEY not set, skipping integration test")
	}

	service := NewOpenAIService(apiKey)
	ctx := context.Background()

	tests := []struct {
		name    string
		content string
		wantErr bool
	}{
		{
			name:    "valid content",
			content: "This is a comprehensive guide about building GraphQL APIs with Go. It covers schema design, resolver implementation, and best practices for production deployments.",
			wantErr: false,
		},
		{
			name:    "empty content",
			content: "",
			wantErr: true,
		},
		{
			name:    "very long content",
			content: string(make([]byte, 10000)), // Will be truncated
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			title, err := service.GenerateTitle(ctx, tt.content)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.NotEmpty(t, title)
				assert.LessOrEqual(t, len(title), 100)
			}
		})
	}
}

func TestOpenAIService_GenerateTags(t *testing.T) {
	// Skip if no API key is set
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		t.Skip("OPENAI_API_KEY not set, skipping integration test")
	}

	service := NewOpenAIService(apiKey)
	ctx := context.Background()

	tests := []struct {
		name    string
		content string
		wantErr bool
	}{
		{
			name:    "technical content",
			content: "GraphQL is a query language for APIs and a runtime for executing those queries. It provides a complete description of the data in your API and gives clients the power to ask for exactly what they need.",
			wantErr: false,
		},
		{
			name:    "empty content",
			content: "",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tags, err := service.GenerateTags(ctx, tt.content)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.NotEmpty(t, tags)
				assert.LessOrEqual(t, len(tags), 5)
				assert.GreaterOrEqual(t, len(tags), 1)
			}
		})
	}
}

func TestOpenAIService_SummarizeContent(t *testing.T) {
	// Skip if no API key is set
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		t.Skip("OPENAI_API_KEY not set, skipping integration test")
	}

	service := NewOpenAIService(apiKey)
	ctx := context.Background()

	content := `GraphQL is a query language for APIs and a runtime for executing those queries. 
	It was developed by Facebook in 2012 and open-sourced in 2015. GraphQL provides a complete 
	and understandable description of the data in your API, gives clients the power to ask for 
	exactly what they need and nothing more, makes it easier to evolve APIs over time, and 
	enables powerful developer tools. Unlike REST APIs where you typically have multiple endpoints 
	for different resources, GraphQL exposes a single endpoint and allows clients to specify 
	exactly what data they need.`

	summary, err := service.SummarizeContent(ctx, content)
	require.NoError(t, err)
	assert.NotEmpty(t, summary)
	assert.Less(t, len(summary), len(content))
}

func TestOpenAIService_MergeContents(t *testing.T) {
	// Skip if no API key is set
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		t.Skip("OPENAI_API_KEY not set, skipping integration test")
	}

	service := NewOpenAIService(apiKey)
	ctx := context.Background()

	contents := []string{
		"GraphQL is a query language for APIs. It was developed by Facebook.",
		"GraphQL provides a complete description of the data in your API and gives clients the power to ask for exactly what they need.",
		"Unlike REST APIs, GraphQL exposes a single endpoint.",
	}

	merged, err := service.MergeContents(ctx, contents)
	require.NoError(t, err)
	assert.NotEmpty(t, merged)
}

func TestTruncateContent(t *testing.T) {
	tests := []struct {
		name     string
		content  string
		maxChars int
		want     string
	}{
		{
			name:     "short content",
			content:  "Hello",
			maxChars: 10,
			want:     "Hello",
		},
		{
			name:     "exact length",
			content:  "Hello",
			maxChars: 5,
			want:     "Hello",
		},
		{
			name:     "long content",
			content:  "Hello World",
			maxChars: 8,
			want:     "Hello...",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := truncateContent(tt.content, tt.maxChars)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestExtractTagsFromText(t *testing.T) {
	tests := []struct {
		name string
		text string
		want []string
	}{
		{
			name: "simple tags",
			text: "GraphQL\nAPI\nREST",
			want: []string{"GraphQL", "API", "REST"},
		},
		{
			name: "tags with punctuation",
			text: "- GraphQL\n- API\n- REST",
			want: []string{"GraphQL", "API", "REST"},
		},
		{
			name: "mixed content",
			text: "Here are the tags:\nGraphQL\nThis is a long sentence that should not be a tag\nAPI",
			want: []string{"GraphQL", "API"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := extractTagsFromText(tt.text)
			assert.Equal(t, tt.want, got)
		})
	}
}