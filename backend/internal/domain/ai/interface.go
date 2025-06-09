package ai

import "context"

// Service defines the interface for AI-related operations
type Service interface {
	// GenerateTitle generates a title from the given content
	GenerateTitle(ctx context.Context, content string) (string, error)
	
	// GenerateTags generates relevant tags from the given content
	GenerateTags(ctx context.Context, content string) ([]string, error)
	
	// SummarizeContent creates a summary of the given content
	SummarizeContent(ctx context.Context, content string) (string, error)
	
	// MergeContents intelligently merges multiple content pieces
	MergeContents(ctx context.Context, contents []string) (string, error)
}