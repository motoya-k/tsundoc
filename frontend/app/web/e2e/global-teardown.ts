async function globalTeardown() {
  console.log('🧹 Starting global teardown for e2e tests...');
  
  // You can add global teardown logic here, such as:
  // - Cleaning up test database
  // - Stopping mock servers
  // - Removing test files
  // - Cleaning up test users
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;