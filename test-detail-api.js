// Test script for detailed property information
const attomId = '34842339';
const apiKey = '76a2d719517dff196a7910cf21124fbf';
const baseUrl = 'https://api.gateway.attomdata.com';

console.log('Getting detailed property information for ATTOM ID:', attomId);
console.log('API Key configured:', !!apiKey);

// Build detail API request
const detailUrl = `${baseUrl}/propertyapi/v1.0.0/property/detail`;
const params = new URLSearchParams({
  attomid: attomId,
  format: 'json'
});

console.log('\nDetail API Request URL:', `${detailUrl}?${params}`);
console.log('\nMaking detail API request...');

// Make the detail API call
fetch(`${detailUrl}?${params}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'apikey': apiKey
  }
})
.then(response => {
  console.log('Response status:', response.status);
  return response.text();
})
.then(responseText => {
  console.log('\nRaw detail response:', responseText);
  
  try {
    const data = JSON.parse(responseText);
    console.log('\nParsed detail JSON response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.property && data.property.length > 0) {
      console.log('\n✅ Detailed property data found!');
      const property = data.property[0];
      
      console.log('\n=== PROPERTY DETAILS ===');
      console.log('Address:', property.address?.oneLine);
      console.log('ATTOM ID:', property.identifier?.attomId);
      
      console.log('\n=== ASSESSMENT DATA ===');
      console.log('Assessed Total Value:', property.assessment?.assessed?.assdTtlValue);
      console.log('Assessed Land Value:', property.assessment?.assessed?.assdLandValue);
      console.log('Assessed Improvement Value:', property.assessment?.assessed?.assdImpValue);
      console.log('Market Total Value:', property.assessment?.market?.mktTtlValue);
      console.log('Market Land Value:', property.assessment?.market?.mktLandValue);
      console.log('Market Improvement Value:', property.assessment?.market?.mktImpValue);
      
      console.log('\n=== TAX DATA ===');
      console.log('Tax Amount:', property.assessment?.tax?.taxAmt);
      console.log('Tax Year:', property.assessment?.tax?.taxYear);
      
      console.log('\n=== BUILDING DATA ===');
      console.log('Building Size:', property.building?.size?.bldgSize);
      console.log('Living Size:', property.building?.size?.livingSize);
      console.log('Year Built:', property.building?.construction?.yearBuilt);
      console.log('Building Type:', property.building?.summary?.bldgType);
      
      console.log('\n=== SALE DATA ===');
      console.log('Sale Amount:', property.sale?.amount?.saleAmt);
      console.log('Sale Date:', property.sale?.transDate);
      
      console.log('\n=== AVM DATA ===');
      console.log('AVM Value:', property.avm?.amount?.value);
      console.log('AVM Date:', property.avm?.eventDate);
      
    } else {
      console.log('\n❌ No detailed property data found');
      console.log('Status message:', data.status?.msg);
    }
  } catch (parseError) {
    console.error('Failed to parse JSON:', parseError);
    console.log('Response text:', responseText);
  }
})
.catch(error => {
  console.error('Detail API Error:', error);
}); 