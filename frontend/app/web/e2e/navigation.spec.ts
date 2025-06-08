import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Navigation', () => {
  test('should navigate between pages without errors', async ({ page }) => {
    // Test navigation from home to other pages
    await page.goto('/');
    await TestHelpers.waitForPageLoad(page);
    
    // Navigate to library
    await page.goto('/library');
    await TestHelpers.waitForPageLoad(page);
    await expect(page).toHaveURL('/library');
    
    // Navigate to save
    await page.goto('/save');
    await TestHelpers.waitForPageLoad(page);
    await expect(page).toHaveURL('/save');
    
    // Navigate back to home
    await page.goto('/');
    await TestHelpers.waitForPageLoad(page);
    await expect(page).toHaveURL('/');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await TestHelpers.waitForPageLoad(page);
    
    // Navigate to library
    await page.goto('/library');
    await TestHelpers.waitForPageLoad(page);
    
    // Use browser back button
    await page.goBack();
    await TestHelpers.waitForPageLoad(page);
    await expect(page).toHaveURL('/');
    
    // Use browser forward button
    await page.goForward();
    await TestHelpers.waitForPageLoad(page);
    await expect(page).toHaveURL('/library');
  });

  test('should handle 404 errors gracefully', async ({ page }) => {
    // Try to navigate to a non-existent page
    const response = await page.goto('/non-existent-page');
    
    // Should get a 404 response
    expect(response?.status()).toBe(404);
    
    // Page should still load (even if it's a 404 page)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain responsive design across all pages', async ({ page }) => {
    const pages = ['/', '/library', '/save'];
    
    for (const url of pages) {
      await TestHelpers.testResponsiveDesign(page, url);
    }
  });
});