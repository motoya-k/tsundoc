package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/sashabaranov/go-openai"
	"github.com/motoya-k/tsundoc/internal/domain/ai"
)

// OpenAIService implements the AI service using OpenAI API
type OpenAIService struct {
	client *openai.Client
}

// NewOpenAIService creates a new OpenAI service instance
func NewOpenAIService(apiKey string) *OpenAIService {
	return &OpenAIService{
		client: openai.NewClient(apiKey),
	}
}

// GenerateTitle generates a title from the given content
func (s *OpenAIService) GenerateTitle(ctx context.Context, content string) (string, error) {
	if content == "" {
		return "", fmt.Errorf("content cannot be empty")
	}

	// Truncate content if too long
	truncatedContent := truncateContent(content, 3000)

	prompt := fmt.Sprintf(`Given the following content, generate a concise and descriptive title (maximum 100 characters).
The title should capture the main topic or key insight from the content.
Output only the title, nothing else.

Content:
%s`, truncatedContent)

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant that generates concise titles for content.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.7,
			MaxTokens:   50,
		},
	)

	if err != nil {
		return "", fmt.Errorf("failed to generate title: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	title := strings.TrimSpace(resp.Choices[0].Message.Content)
	
	// Ensure title is not too long
	if len(title) > 100 {
		title = title[:97] + "..."
	}

	return title, nil
}

// GenerateTags generates relevant tags from the given content
func (s *OpenAIService) GenerateTags(ctx context.Context, content string) ([]string, error) {
	if content == "" {
		return []string{}, fmt.Errorf("content cannot be empty")
	}

	// Truncate content if too long
	truncatedContent := truncateContent(content, 3000)

	prompt := fmt.Sprintf(`Analyze the following content and generate 3-5 relevant tags.
Tags should be single words or short phrases that capture key topics, technologies, or concepts.
Output the tags as a JSON array of strings.

Content:
%s`, truncatedContent)

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant that generates relevant tags for content. Always output valid JSON.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.5,
			MaxTokens:   100,
		},
	)

	if err != nil {
		return []string{}, fmt.Errorf("failed to generate tags: %w", err)
	}

	if len(resp.Choices) == 0 {
		return []string{}, fmt.Errorf("no response from OpenAI")
	}

	// Parse JSON response
	var tags []string
	responseContent := strings.TrimSpace(resp.Choices[0].Message.Content)
	if err := json.Unmarshal([]byte(responseContent), &tags); err != nil {
		// Fallback: try to extract tags from non-JSON response
		tags = extractTagsFromText(responseContent)
	}

	// Limit to 5 tags
	if len(tags) > 5 {
		tags = tags[:5]
	}

	return tags, nil
}

// SummarizeContent creates a summary of the given content
func (s *OpenAIService) SummarizeContent(ctx context.Context, content string) (string, error) {
	if content == "" {
		return "", fmt.Errorf("content cannot be empty")
	}

	// Truncate content if too long
	truncatedContent := truncateContent(content, 4000)

	prompt := fmt.Sprintf(`Create a concise summary of the following content.
The summary should capture the main points and key insights.
Keep it under 300 words.

Content:
%s`, truncatedContent)

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant that creates concise summaries.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.5,
			MaxTokens:   400,
		},
	)

	if err != nil {
		return "", fmt.Errorf("failed to summarize content: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return strings.TrimSpace(resp.Choices[0].Message.Content), nil
}

// MergeContents intelligently merges multiple content pieces
func (s *OpenAIService) MergeContents(ctx context.Context, contents []string) (string, error) {
	if len(contents) == 0 {
		return "", fmt.Errorf("no content to merge")
	}

	// Combine all contents with separators
	combinedContent := strings.Join(contents, "\n\n---\n\n")
	truncatedContent := truncateContent(combinedContent, 6000)

	prompt := fmt.Sprintf(`You have multiple pieces of related content below.
Please merge them intelligently by:
1. Removing duplicate information
2. Organizing content logically
3. Preserving all unique insights and information
4. Creating a coherent flow

Contents to merge:
%s`, truncatedContent)

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant that merges related content intelligently while preserving all important information.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.3,
			MaxTokens:   2000,
		},
	)

	if err != nil {
		return "", fmt.Errorf("failed to merge contents: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return strings.TrimSpace(resp.Choices[0].Message.Content), nil
}

// Ensure interface compliance
var _ ai.Service = (*OpenAIService)(nil)

// Helper functions

func truncateContent(content string, maxChars int) string {
	if len(content) <= maxChars {
		return content
	}
	return content[:maxChars-3] + "..."
}

func extractTagsFromText(text string) []string {
	// Simple extraction logic for fallback
	var tags []string
	lines := strings.Split(text, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line != "" && !strings.Contains(line, " ") || len(line) < 30 {
			// Remove common punctuation
			tag := strings.Trim(line, ".,;:-\"'[](){}")
			if tag != "" {
				tags = append(tags, tag)
			}
		}
	}
	return tags
}