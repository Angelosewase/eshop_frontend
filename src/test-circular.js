// This is a simple script to test for circular dependencies
console.log('Starting circular dependency test...');

try {
  // Try importing the store
  const store = require('./store').default;
  console.log('Store imported successfully!');

  // Try getting the state
  const state = store.getState();
  console.log('Current state:', state);

  console.log('No circular dependencies detected!');
} catch (error) {
  console.error('Error detected:', error.message);
  console.error('Stack trace:', error.stack);
} 