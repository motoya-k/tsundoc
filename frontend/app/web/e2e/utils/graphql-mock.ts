import { Page } from '@playwright/test';

/**
 * GraphQL mocking utilities for e2e tests
 */
export class GraphQLMock {
  /**
   * Mock GraphQL responses by intercepting network requests
   */
  static async mockGraphQLResponse(
    page: Page, 
    operationName: string, 
    response: any,
    statusCode = 200
  ) {
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = request.postData();
      
      if (postData) {
        try {
          const body = JSON.parse(postData);
          if (body.operationName === operationName) {
            await route.fulfill({
              status: statusCode,
              contentType: 'application/json',
              body: JSON.stringify({
                data: response,
                errors: statusCode >= 400 ? [{ message: 'GraphQL Error' }] : undefined
              })
            });
            return;
          }
        } catch (e) {
          // Continue with original request if parsing fails
        }
      }
      
      // Continue with original request for other operations
      await route.continue();
    });
  }

  /**
   * Mock multiple GraphQL operations
   */
  static async mockMultipleOperations(page: Page, mocks: Array<{
    operationName: string;
    response: any;
    statusCode?: number;
  }>) {
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = request.postData();
      
      if (postData) {
        try {
          const body = JSON.parse(postData);
          const mock = mocks.find(m => m.operationName === body.operationName);
          
          if (mock) {
            await route.fulfill({
              status: mock.statusCode || 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: mock.response,
                errors: (mock.statusCode && mock.statusCode >= 400) ? [{ message: 'GraphQL Error' }] : undefined
              })
            });
            return;
          }
        } catch (e) {
          // Continue with original request if parsing fails
        }
      }
      
      // Continue with original request for unmocked operations
      await route.continue();
    });
  }

  /**
   * Mock books query with sample data
   */
  static async mockMyBooksQuery(page: Page, books: Array<{
    id: string;
    title: string;
    content?: string;
    tags?: string[];
    createdAt?: string;
  }> = []) {
    const defaultBooks = books.length > 0 ? books : [
      {
        id: '1',
        title: 'Sample Book 1',
        content: 'This is a sample book content for testing',
        tags: ['fiction', 'sample'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2', 
        title: 'Sample Book 2',
        content: 'Another sample book for e2e testing',
        tags: ['non-fiction', 'test'],
        createdAt: new Date().toISOString()
      }
    ];

    await this.mockGraphQLResponse(page, 'MyBooks', {
      myBooks: defaultBooks
    });
  }

  /**
   * Mock save book mutation
   */
  static async mockSaveBookMutation(page: Page, savedBook = {
    id: 'new-book-123',
    title: 'New Saved Book',
    content: 'Saved book content',
    tags: ['new'],
    createdAt: new Date().toISOString()
  }) {
    await this.mockGraphQLResponse(page, 'SaveBook', {
      saveBook: savedBook
    });
  }

  /**
   * Mock GraphQL errors
   */
  static async mockGraphQLError(page: Page, operationName: string, errorMessage = 'Test error') {
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = request.postData();
      
      if (postData) {
        try {
          const body = JSON.parse(postData);
          if (body.operationName === operationName) {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: null,
                errors: [{ message: errorMessage }]
              })
            });
            return;
          }
        } catch (e) {
          // Continue with original request if parsing fails
        }
      }
      
      await route.continue();
    });
  }

  /**
   * Clear all GraphQL mocks
   */
  static async clearMocks(page: Page) {
    await page.unroute('**/graphql');
  }
}