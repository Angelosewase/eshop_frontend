import { store } from './store';

console.log('Store imported successfully:', store);

// Just a test function to verify the store is working
export function testStore() {
  const state = store.getState();
  console.log('Current state:', state);
  return state;
}

export default testStore; 