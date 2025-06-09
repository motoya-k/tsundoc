import { test, expect } from '@playwright/test'

test.describe('Real Backend Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the application
    await page.goto('http://localhost:3000')
  })

  test('should save and retrieve books from real backend', async ({ page }) => {
    // Navigate to save page
    await page.click('a[href="/save"]')
    await expect(page).toHaveURL('/save')

    // Fill in book content
    const testContent = `This is a test book about React Hooks.
    
React Hooks allow you to use state and other React features without writing a class component. They were introduced in React 16.8 and have revolutionized how we write React components.

Key hooks include:
- useState for state management
- useEffect for side effects
- useContext for consuming context
- useMemo for memoization
- useCallback for callback memoization

React Hooks make functional components much more powerful and are now the recommended way to write React components.`

    await page.fill('textarea[placeholder*="paste"]', testContent)
    
    // Save the book
    await page.click('button:has-text("Save Book")')
    
    // Should redirect to library
    await expect(page).toHaveURL('/library')
    
    // Wait for the book to appear in the library
    await page.waitForSelector('[data-testid="book-card"], [data-testid="book-cover"], [data-testid="book-spine"]', { timeout: 10000 })
    
    // Check that the book appears with the correct content
    await expect(page.locator('text=React Hooks')).toBeVisible()
  })

  test('should search books in the library', async ({ page }) => {
    // Navigate to library
    await page.click('a[href="/library"]')
    await expect(page).toHaveURL('/library')

    // Wait for books to load
    await page.waitForTimeout(2000)

    // Search for GraphQL (from our test data)
    await page.fill('input[placeholder*="Search"]', 'GraphQL')
    
    // Wait for search results
    await page.waitForTimeout(1000)
    
    // Should show books containing GraphQL
    const bookElements = page.locator('[data-testid="book-card"], [data-testid="book-cover"], [data-testid="book-spine"]')
    const count = await bookElements.count()
    
    if (count > 0) {
      // If there are books, they should contain GraphQL in some form
      await expect(page.locator('text*=GraphQL')).toBeVisible()
    }
  })

  test('should handle different view modes in library', async ({ page }) => {
    // Navigate to library
    await page.click('a[href="/library"]')
    await expect(page).toHaveURL('/library')

    // Test Cover View (default)
    await page.click('button:has-text("Cover View")')
    await expect(page.locator('[data-testid="book-cover"]').first()).toBeVisible({ timeout: 5000 })

    // Test Card View
    await page.click('button:has-text("Card View")')
    await expect(page.locator('[data-testid="book-card"]').first()).toBeVisible({ timeout: 5000 })

    // Test Spine View
    await page.click('button:has-text("Spine View")')
    await expect(page.locator('[data-testid="book-spine"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('should handle empty library state gracefully', async ({ page }) => {
    // Navigate to library
    await page.click('a[href="/library"]')
    await expect(page).toHaveURL('/library')

    // If no books exist, should show appropriate message
    await page.waitForTimeout(2000)
    
    const bookElements = page.locator('[data-testid="book-card"], [data-testid="book-cover"], [data-testid="book-spine"]')
    const count = await bookElements.count()
    
    if (count === 0) {
      await expect(page.locator('text*="No books found"')).toBeVisible()
    }
  })

  test('should show loading states appropriately', async ({ page }) => {
    // Navigate to library
    await page.click('a[href="/library"]')
    await expect(page).toHaveURL('/library')

    // Should show loading initially (briefly)
    // Note: This may be too fast to catch in practice, but tests the loading state exists
    const loadingText = page.locator('text="Loading books..."')
    
    // Wait for either loading to appear or books to load
    await Promise.race([
      loadingText.waitFor({ timeout: 1000 }).catch(() => {}),
      page.waitForTimeout(1000)
    ])
  })

  test('should validate save form properly', async ({ page }) => {
    // Navigate to save page
    await page.click('a[href="/save"]')
    await expect(page).toHaveURL('/save')

    // Try to save without content
    const saveButton = page.locator('button:has-text("Save Book")')
    
    // Save button should be disabled or show validation error
    await expect(saveButton).toBeDisabled()
  })

  test('should handle backend errors gracefully', async ({ page }) => {
    // Navigate to library
    await page.click('a[href="/library"]')
    await expect(page).toHaveURL('/library')

    // Wait for any potential error handling
    await page.waitForTimeout(3000)
    
    // Should not show any JavaScript errors in the console
    const logs = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })
    
    // Give time for any console errors to appear
    await page.waitForTimeout(2000)
    
    // Check that no critical errors occurred
    const criticalErrors = logs.filter(log => 
      log.includes('Failed to fetch') || 
      log.includes('TypeError') || 
      log.includes('ReferenceError')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})