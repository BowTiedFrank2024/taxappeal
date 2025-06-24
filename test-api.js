// Simple test script to verify ATTOM API configuration
// Run with: node test-api.js

const testAddress = process.argv[2] || '123 Main Street, Austin, TX';

console.log('Testing ATTOM API with address:', testAddress);
console.log('API Key configured:', !!process.env.VITE_ATTOM_API_KEY);
console.log('Base URL:', process.env.VITE_API_BASE_URL || 'https://api.gateway.attomdata.com');

if (!process.env.VITE_ATTOM_API_KEY) {
  console.error('\n❌ VITE_ATTOM_API_KEY not found in environment variables');
  console.log('\nTo set up the API key:');
  console.log('1. Create a .env file in the project root');
  console.log('2. Add: VITE_ATTOM_API_KEY=your_api_key_here');
  console.log('3. Get your API key from: https://api.developer.attomdata.com/');
  process.exit(1);
}

// Parse address (simplified version)
const addressParts = testAddress.split(',').map(part => part.trim());
const streetAddress = addressParts[0] || '';
const city = addressParts[1] || '';
const state = addressParts[2]?.split(' ')[0] || '';

console.log('\nParsed address components:');
console.log('- Street:', streetAddress);
console.log('- City:', city);
console.log('- State:', state);

const searchUrl = `${process.env.VITE_API_BASE_URL || 'https://api.gateway.attomdata.com'}/propertyapi/v1.0.0/property/address`;
const params = new URLSearchParams({
  address1: streetAddress,
  address2: city + (state ? `, ${state}` : ''),
  format: 'json'
});

console.log('\nAPI Request URL:', `${searchUrl}?${params}`);

// Note: This script doesn't make the actual API call since it's a simple test
// The actual API call would be made in the React application
console.log('\n✅ Configuration looks good!');
console.log('Start the development server with: npm run dev');
console.log('Then test the API in the browser at: http://localhost:5173/api-test'); 