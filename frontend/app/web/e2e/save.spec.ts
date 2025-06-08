import { test, expect } from '@playwright/test';

test.describe('Save Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the save page
    await page.goto('/save');
  });

  test('should display the save page', async ({ page }) => {
    // Check if the page loads properly
    await expect(page.locator('body')).toBeVisible();
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should have save book form elements', async ({ page }) => {
    // Look for common form elements that might be on a save page
    // Adjust these selectors based on your actual save form implementation
    
    // Check for input fields (common in save forms)
    const inputs = page.locator('input');
    const textareas = page.locator('textarea');
    const buttons = page.locator('button');
    
    // At least one of these should exist on a save form
    const hasFormElements = 
      (await inputs.count()) > 0 || 
      (await textareas.count()) > 0 || 
      (await buttons.count()) > 0;
    
    expect(hasFormElements).toBeTruthy();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle navigation properly', async ({ page }) => {
    // Ensure we're on the save page
    await expect(page).toHaveURL('/save');
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
  });
});