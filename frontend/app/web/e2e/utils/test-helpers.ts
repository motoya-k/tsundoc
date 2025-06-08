import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for e2e tests
 */

export class TestHelpers {
  /**
   * Wait for the page to load completely
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if an element is visible and contains text
   */
  static async expectElementWithText(page: Page, selector: string, text: string): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    await expect(element).toContainText(text);
  }

  /**
   * Test responsive design across different viewports
   */
  static async testResponsiveDesign(page: Page, url: string): Promise<void> {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1200, height: 800, name: 'desktop' },
      { width: 1920, height: 1080, name: 'large-desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(url);
      await this.waitForPageLoad(page);
      await expect(page.locator('body')).toBeVisible();
    }
  }

  /**
   * Fill form field if it exists
   */
  static async fillFieldIfExists(page: Page, selector: string, value: string): Promise<void> {
    const field = page.locator(selector);
    if (await field.isVisible()) {
      await field.fill(value);
    }
  }

  /**
   * Click button if it exists
   */
  static async clickIfExists(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      await element.click();
    }
  }

  /**
   * Wait for loading state to complete
   */
  static async waitForLoadingToComplete(page: Page): Promise<void> {
    // Wait for any loading spinners or loading text to disappear
    const loadingIndicators = [
      'Loading...',
      'loading',
      '[data-testid="loading"]',
      '.loading',
      '.spinner'
    ];

    for (const indicator of loadingIndicators) {
      try {
        await page.waitForSelector(indicator, { state: 'hidden', timeout: 5000 });
      } catch {
        // Ignore if the loading indicator doesn't exist
      }
    }
  }

  /**
   * Check if error messages are handled properly
   */
  static async checkErrorHandling(page: Page): Promise<void> {
    // Look for common error message patterns
    const errorSelectors = [
      '[role="alert"]',
      '.error',
      '.alert-error',
      '[data-testid="error"]'
    ];

    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector);
      if (await errorElement.isVisible()) {
        // If there's an error, it should have meaningful text
        const text = await errorElement.textContent();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);
      }
    }
  }
}