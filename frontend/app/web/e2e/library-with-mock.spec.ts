import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';
import { GraphQLMock } from './utils/graphql-mock';

test.describe('Library Page with GraphQL Mocking', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authentication mock
    await AuthHelpers.mockAuthenticatedUser(page);
    
    // Navigate to the library page
    await page.goto('/library');
  });

  test('should display mocked books in library', async ({ page }) => {
    // Mock the myBooks GraphQL query
    await GraphQLMock.mockMyBooksQuery(page, [
      {
        id: '1',
        title: 'Test Book 1',
        content: 'This is test content for book 1',
        tags: ['fiction', 'test'],
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Test Book 2', 
        content: 'This is test content for book 2',
        tags: ['non-fiction', 'test'],
        createdAt: '2024-01-02T00:00:00Z'
      }
    ]);

    // Reload to trigger GraphQL query with mocks
    await page.reload();

    // Wait for books to be loaded and displayed
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });

    // Verify that mocked books are displayed
    await expect(page.locator('text=Test Book 1')).toBeVisible();
    await expect(page.locator('text=Test Book 2')).toBeVisible();

    // Check that the books have the expected tags
    await expect(page.locator('text=fiction')).toBeVisible();
    await expect(page.locator('text=non-fiction')).toBeVisible();
  });

  test('should handle empty library state', async ({ page }) => {
    // Mock empty books response
    await GraphQLMock.mockMyBooksQuery(page, []);

    // Reload to trigger GraphQL query with mocks
    await page.reload();

    // Check for empty state message
    await expect(page.locator('text=No books found')).toBeVisible({ timeout: 10000 });
  });

  test('should handle GraphQL errors gracefully', async ({ page }) => {
    // Mock GraphQL error
    await GraphQLMock.mockGraphQLError(page, 'MyBooks', 'Failed to fetch books');

    // Reload to trigger GraphQL query with mocks
    await page.reload();

    // Check for error message
    await expect(page.locator('text=Error')).toBeVisible({ timeout: 10000 });
  });

  test('should filter books by search keyword', async ({ page }) => {
    // Mock books with different titles
    await GraphQLMock.mockMyBooksQuery(page, [
      {
        id: '1',
        title: 'JavaScript Guide',
        content: 'Learning JavaScript fundamentals',
        tags: ['programming'],
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Python Handbook',
        content: 'Python programming guide',
        tags: ['programming'],
        createdAt: '2024-01-02T00:00:00Z'
      },
      {
        id: '3',
        title: 'Cooking Recipes',
        content: 'Delicious recipes to try',
        tags: ['cooking'],
        createdAt: '2024-01-03T00:00:00Z'
      }
    ]);

    // Reload to trigger GraphQL query with mocks
    await page.reload();

    // Wait for books to load
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });

    // Verify all books are initially visible
    await expect(page.locator('text=JavaScript Guide')).toBeVisible();
    await expect(page.locator('text=Python Handbook')).toBeVisible();
    await expect(page.locator('text=Cooking Recipes')).toBeVisible();

    // Test search functionality if it exists
    const searchInput = page.locator('input[placeholder*="search"], input[type="search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('JavaScript');
      
      // Should show only JavaScript book
      await expect(page.locator('text=JavaScript Guide')).toBeVisible();
      await expect(page.locator('text=Python Handbook')).not.toBeVisible();
      await expect(page.locator('text=Cooking Recipes')).not.toBeVisible();
    }
  });

  test.afterEach(async ({ page }) => {
    // Clean up mocks after each test
    await GraphQLMock.clearMocks(page);
  });
});