import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for e2e tests...');
  
  // You can add global setup logic here, such as:
  // - Setting up test database
  // - Starting mock servers
  // - Creating test users
  // - Seeding test data
  
  // For now, we'll just verify that the base URL is accessible
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking if base URL is accessible...');
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    console.log('✅ Base URL is accessible');
  } catch (error) {
    console.log('⚠️  Base URL might not be ready yet, tests will handle this');
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;