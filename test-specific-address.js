// Test script for specific address: 2400 Woodhaven Drive, Orono, MN 55356

const testAddress = '2400 Woodhaven Drive, Orono, MN 55356';
const apiKey = '76a2d719517dff196a7910cf21124fbf';
const baseUrl = 'https://api.gateway.attomdata.com';

console.log('Testing address:', testAddress);
console.log('API Key configured:', !!apiKey);
console.log('Base URL:', baseUrl);

// Parse address components
const addressParts = testAddress.split(',').map(part => part.trim());
const streetAddress = addressParts[0] || '';
const city = addressParts[1] || '';
const state = addressParts[2]?.split(' ')[0] || '';
const zipCode = addressParts[2]?.split(' ')[1] || '';

console.log('\nParsed address components:');
console.log('- Street:', streetAddress);
console.log('- City:', city);
console.log('- State:', state);
console.log('- ZIP:', zipCode);

// Build API request
const searchUrl = `${baseUrl}/propertyapi/v1.0.0/property/address`;
const params = new URLSearchParams({
  address1: streetAddress,
  address2: city + (state ? `, ${state}` : '') + (zipCode ? ` ${zipCode}` : ''),
  format: 'json'
});

console.log('\nAPI Request URL:', `${searchUrl}?${params}`);
console.log('\nMaking API request...');

// Make the API call
fetch(`${searchUrl}?${params}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'apikey': apiKey
  }
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  return response.text();
})
.then(responseText => {
  console.log('\nRaw response:', responseText);
  
  try {
    const data = JSON.parse(responseText);
    console.log('\nParsed JSON response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.property && data.property.length > 0) {
      console.log('\n✅ Property found!');
      const property = data.property[0];
      console.log('ATTOM ID:', property.identifier?.attomId);
      console.log('Address:', property.address?.oneLine);
      console.log('Assessed Value:', property.assessment?.assessed?.assdTtlValue);
      console.log('Market Value:', property.assessment?.market?.mktTtlValue);
      console.log('Tax Amount:', property.assessment?.tax?.taxAmt);
    } else {
      console.log('\n❌ No property found in response');
      console.log('Status message:', data.status?.msg);
    }
  } catch (parseError) {
    console.error('Failed to parse JSON:', parseError);
    console.log('Response text:', responseText);
  }
})
.catch(error => {
  console.error('API Error:', error);
}); 