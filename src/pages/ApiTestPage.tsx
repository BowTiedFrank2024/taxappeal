import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Copy } from 'lucide-react';

const ApiTestPage = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApiCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiKey = import.meta.env.VITE_ATTOM_API_KEY;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.gateway.attomdata.com';
      
      if (!apiKey) {
        throw new Error('ATTOM API key not found. Please add VITE_ATTOM_API_KEY to your .env file');
      }

      // Parse address components
      const addressParts = address.split(',').map(part => part.trim());
      const streetAddress = addressParts[0] || '';
      const city = addressParts[1] || '';
      const state = addressParts[2]?.split(' ')[0] || '';

      console.log('Making API call with:', { streetAddress, city, state });

      // ATTOM Data property search endpoint - according to official docs
      const searchUrl = `${baseUrl}/propertyapi/v1.0.0/property/address`;
      const params = new URLSearchParams({
        address1: streetAddress,
        address2: city + (state ? `, ${state}` : ''),
        format: 'json'
      });

      console.log('API URL:', `${searchUrl}?${params}`);
      console.log('Headers:', {
        'Accept': 'application/json',
        'apikey': apiKey.substring(0, 8) + '...' // Log partial key for debugging
      });

      const searchResponse = await fetch(`${searchUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apikey': apiKey
        }
      });

      console.log('Response status:', searchResponse.status);
      console.log('Response headers:', Object.fromEntries(searchResponse.headers.entries()));

      const responseText = await searchResponse.text();
      console.log('Raw response:', responseText);

      let searchData;
      try {
        searchData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Failed to parse JSON response: ${responseText}`);
      }

      // Handle specific case where API returns 400 with "SuccessWithoutResult"
      if (!searchResponse.ok) {
        if (searchResponse.status === 400 && searchData.status?.msg === 'SuccessWithoutResult') {
          // This is not an error - it means no results were found
          setResponse(searchData);
          return;
        } else if (searchResponse.status === 401) {
          throw new Error('Invalid API key. Please check your VITE_ATTOM_API_KEY configuration.');
        } else if (searchResponse.status === 403) {
          throw new Error('API access denied. Please check your API key permissions.');
        } else if (searchResponse.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        } else {
          throw new Error(`API Error: ${searchResponse.status} - ${searchResponse.statusText}\nResponse: ${responseText}`);
        }
      }
      
      // If we get property data, also try to fetch detailed property info
      if (searchData.property && searchData.property.length > 0) {
        try {
          const propertyId = searchData.property[0].identifier?.attomId;
          
          if (propertyId) {
            // Get detailed property information using ATTOM ID
            const detailUrl = `${baseUrl}/propertyapi/v1.0.0/property/detail`;
            const detailParams = new URLSearchParams({
              attomid: propertyId,
              format: 'json'
            });

            console.log('Making detail request to:', `${detailUrl}?${detailParams}`);

            const detailResponse = await fetch(`${detailUrl}?${detailParams}`, {
              headers: {
                'Accept': 'application/json',
                'apikey': apiKey
              }
            });

            if (detailResponse.ok) {
              const detailText = await detailResponse.text();
              const detailData = JSON.parse(detailText);
              setResponse({
                search: searchData,
                detail: detailData
              });
            } else {
              console.warn('Detail request failed:', detailResponse.status, detailResponse.statusText);
              setResponse({ search: searchData });
            }
          } else {
            setResponse({ search: searchData });
          }
        } catch (detailError) {
          console.warn('Failed to fetch property details:', detailError);
          setResponse({ search: searchData });
        }
      } else {
        setResponse(searchData);
      }

    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            ATTOM Data API Test
          </h1>
          <p className="text-xl text-gray-700">
            Test the API connection and explore response data structure
          </p>
        </div>

        {/* API Configuration Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Configuration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              {import.meta.env.VITE_ATTOM_API_KEY ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={import.meta.env.VITE_ATTOM_API_KEY ? 'text-green-800' : 'text-red-800'}>
                API Key: {import.meta.env.VITE_ATTOM_API_KEY ? 'Configured' : 'Missing'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">
                Base URL: {import.meta.env.VITE_API_BASE_URL || 'Using default'}
              </span>
            </div>
          </div>
          
          {!import.meta.env.VITE_ATTOM_API_KEY && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                <strong>Setup Required:</strong> Create a <code>.env</code> file in your project root with:
              </p>
              <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                VITE_ATTOM_API_KEY=your_api_key_here{'\n'}
                VITE_API_BASE_URL=https://api.gateway.attomdata.com
              </pre>
            </div>
          )}
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Test Property Lookup</h2>
          
          <form onSubmit={testApiCall} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter property address (e.g., 123 Main St, Austin, TX)"
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !address.trim() || !import.meta.env.VITE_ATTOM_API_KEY}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Test API</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Addresses */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Sample Addresses to Test:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                '4529 Winfield Avenue, Fort Worth, TX',
                '1234 Elm Street, Dallas, TX',
                '5678 Oak Avenue, Austin, TX',
                '9012 Pine Street, Houston, TX'
              ].map((sampleAddress, index) => (
                <button
                  key={index}
                  onClick={() => setAddress(sampleAddress)}
                  className="text-left p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {sampleAddress}
                </button>
              ))}
            </div>
          </div>

          {/* Debug Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>API Key (first 8 chars): {import.meta.env.VITE_ATTOM_API_KEY?.substring(0, 8)}...</p>
              <p>Base URL: {import.meta.env.VITE_API_BASE_URL || 'https://api.gateway.attomdata.com'}</p>
              <p>Current Address: {address || 'None entered'}</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">API Error</h3>
                <pre className="text-red-800 text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">API Response</h2>
              <button
                onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy JSON</span>
              </button>
            </div>
            
            {/* Response Summary */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">API Call Successful</span>
              </div>
              <div className="text-sm text-green-800">
                {response.search?.property?.length > 0 ? (
                  <p>Found {response.search.property.length} property record(s)</p>
                ) : response.status?.msg === 'SuccessWithoutResult' ? (
                  <p>No properties found for this address - this is normal for addresses not in the database</p>
                ) : (
                  <p>No properties found for this address</p>
                )}
              </div>
            </div>

            {/* Formatted Response */}
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>

            {/* Data Structure Analysis */}
            {response.search?.property?.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Data Structure Analysis</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✓ Property found in search results</p>
                  <p>✓ ATTOM ID: {response.search.property[0]?.identifier?.attomId}</p>
                  <p>✓ Address: {response.search.property[0]?.address?.oneLine}</p>
                  {response.detail && <p>✓ Detailed property data available</p>}
                </div>
              </div>
            )}

            {/* No Results Information */}
            {response.status?.msg === 'SuccessWithoutResult' && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-3">No Results Found</h3>
                <div className="text-sm text-amber-800 space-y-1">
                  <p>The API successfully processed your request but found no matching properties.</p>
                  <p>This could mean:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>The address doesn't exist in the ATTOM database</li>
                    <li>The address format needs to be adjusted</li>
                    <li>The property is too new or not yet indexed</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;