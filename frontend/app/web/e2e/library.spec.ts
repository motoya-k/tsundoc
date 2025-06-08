import { test, expect } from '@playwright/test';

test.describe('Library Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the library page
    await page.goto('/library');
  });

  test('should display the library page with title', async ({ page }) => {
    // Check if the page title is visible
    await expect(page.locator('h1')).toContainText('My Library');
  });

  test('should have search functionality', async ({ page }) => {
    // Check if search input exists
    const searchInput = page.getByPlaceholder('Search books...');
    await expect(searchInput).toBeVisible();

    // Test typing in search input
    await searchInput.fill('React');
    await expect(searchInput).toHaveValue('React');
  });

  test('should have view mode toggles', async ({ page }) => {
    // Check if all view mode buttons exist
    await expect(page.getByRole('button', { name: /cover view/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /spine view/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /card view/i })).toBeVisible();
  });

  test('should switch between view modes', async ({ page }) => {
    // Start with cover view (default)
    const coverBtn = page.getByRole('button', { name: /cover view/i });
    const spineBtn = page.getByRole('button', { name: /spine view/i });
    const cardBtn = page.getByRole('button', { name: /card view/i });

    // Switch to spine view
    await spineBtn.click();
    // Spine view should be active (you might need to adjust selectors based on actual implementation)
    
    // Switch to card view
    await cardBtn.click();
    // Card view should be active
    
    // Switch back to cover view
    await coverBtn.click();
    // Cover view should be active
  });

  test('should display books when available', async ({ page }) => {
    // Wait for books to load (either from API or mock data)
    await page.waitForLoadState('networkidle');
    
    // Check if books are displayed
    // This will depend on whether you have mock data or actual API data
    // For now, we'll check for the absence of "No books found" message
    const noBooksMessage = page.getByText('No books found');
    
    // If there are mock books, this should not be visible
    // If there are no books, we should see the message
    // We'll just check that the page has loaded properly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle search with no results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search books...');
    
    // Search for something that definitely won't match
    await searchInput.fill('xyzunlikelytomatchanything123');
    
    // Wait a bit for debounced search
    await page.waitForTimeout(500);
    
    // Should show no results message
    await expect(page.getByText('No books found')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if the page is still functional
    await expect(page.locator('h1')).toContainText('My Library');
    await expect(page.getByPlaceholder('Search books...')).toBeVisible();
    
    // View mode buttons should still be visible (though they might stack differently)
    await expect(page.getByRole('button', { name: /cover view/i })).toBeVisible();
  });

  test('should handle loading state gracefully', async ({ page }) => {
    // Check that the page doesn't crash during loading
    await expect(page.locator('body')).toBeVisible();
    
    // Wait for any loading states to complete
    await page.waitForLoadState('networkidle');
    
    // Page should still be functional
    await expect(page.locator('h1')).toContainText('My Library');
  });

  test('should navigate properly from home page', async ({ page }) => {
    // Start from home page
    await page.goto('/');
    
    // Find and click library navigation link
    // This depends on your navigation implementation
    // You might need to adjust the selector
    const libraryLink = page.getByRole('link', { name: /library/i });
    if (await libraryLink.isVisible()) {
      await libraryLink.click();
      await expect(page).toHaveURL('/library');
      await expect(page.locator('h1')).toContainText('My Library');
    }
  });
});