import { Page } from '@playwright/test';

/**
 * Authentication helpers for Firebase Auth in e2e tests
 */
export class AuthHelpers {
  /**
   * Mock Firebase Auth user login
   * This helper can be used to simulate authenticated user state
   */
  static async mockAuthenticatedUser(page: Page, userInfo = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User'
  }) {
    // Mock the Firebase Auth state
    await page.addInitScript((user) => {
      // Mock Firebase Auth object
      window.mockFirebaseAuth = {
        currentUser: user,
        onAuthStateChanged: (callback: any) => {
          setTimeout(() => callback(user), 100);
          return () => {};
        }
      };
      
      // Override Firebase imports if they exist
      if (window.firebase) {
        window.firebase.auth = () => window.mockFirebaseAuth;
      }
    }, userInfo);
  }

  /**
   * Mock unauthenticated state
   */
  static async mockUnauthenticatedUser(page: Page) {
    await page.addInitScript(() => {
      window.mockFirebaseAuth = {
        currentUser: null,
        onAuthStateChanged: (callback: any) => {
          setTimeout(() => callback(null), 100);
          return () => {};
        }
      };
      
      if (window.firebase) {
        window.firebase.auth = () => window.mockFirebaseAuth;
      }
    });
  }

  /**
   * Mock sign in process
   */
  static async mockSignIn(page: Page, userInfo = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User'
  }) {
    await page.evaluate((user) => {
      if (window.mockFirebaseAuth) {
        window.mockFirebaseAuth.currentUser = user;
        // Trigger auth state change listeners
        const event = new CustomEvent('authStateChanged', { detail: user });
        window.dispatchEvent(event);
      }
    }, userInfo);
  }

  /**
   * Mock sign out process
   */
  static async mockSignOut(page: Page) {
    await page.evaluate(() => {
      if (window.mockFirebaseAuth) {
        window.mockFirebaseAuth.currentUser = null;
        // Trigger auth state change listeners
        const event = new CustomEvent('authStateChanged', { detail: null });
        window.dispatchEvent(event);
      }
    });
  }

  /**
   * Wait for auth state to be loaded
   */
  static async waitForAuthState(page: Page, timeout = 5000) {
    await page.waitForFunction(
      () => {
        return window.mockFirebaseAuth !== undefined;
      },
      { timeout }
    );
  }
}

/**
 * Type definitions for global objects
 */
declare global {
  interface Window {
    mockFirebaseAuth: any;
    firebase: any;
  }
}