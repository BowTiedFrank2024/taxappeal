import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, AlertCircle, Home, MapPin, Info } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { attomApiService } from '../services/attomApi';
import { mapAttomDataToPropertyData, validatePropertyData } from '../utils/propertyDataMapper';
import ProgressBar from '../components/ProgressBar';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { searchAddress, setPropertyData } = useProperty();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Connecting to property database...');
  const [error, setError] = useState<string | null>(null);
  const [isAddressNotFound, setIsAddressNotFound] = useState(false);
  const [hasDataWarnings, setHasDataWarnings] = useState(false);
  const [dataWarnings, setDataWarnings] = useState<string[]>([]);

  const steps = ['Analyze Property', 'Confirm Details', 'Assessment', 'Get Results'];

  useEffect(() => {
    if (!searchAddress) {
      navigate('/');
      return;
    }

    analyzeProperty();
  }, [searchAddress, navigate, setPropertyData]);

  const analyzeProperty = async () => {
    const analysisSteps = [
      'Connecting to property database...',
      'Searching property records...',
      'Analyzing tax history...',
      'Calculating assessment data...',
      'Reviewing comparable properties...',
      'Generating property profile...'
    ];

    try {
      // Show progress through analysis steps
      for (let i = 0; i < analysisSteps.length - 1; i++) {
        setStatus(analysisSteps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setStatus(analysisSteps[analysisSteps.length - 1]);

      // Make actual API call
      const apiResult = await attomApiService.getFullPropertyData(searchAddress);
      
      // Check if we found property data
      if (!apiResult.search.property || apiResult.search.property.length === 0) {
        setIsAddressNotFound(true);
        setError('We couldn\'t find this property in our database. This could be because:\n\n• The address format needs adjustment\n• The property isn\'t in our records yet\n• There might be a spelling error in the address\n\nTry using the full address format: "123 Main Street, City, State ZIP"');
        setLoading(false);
        return;
      }

      // Map API data to our PropertyData format
      const searchProperty = apiResult.search.property[0];
      const detailProperty = apiResult.detail?.property?.[0];
      
      const mappedData = mapAttomDataToPropertyData(searchProperty, detailProperty);
      
      // Validate the mapped data
      const validation = validatePropertyData(mappedData);
      if (!validation.isValid) {
        console.error('Property data validation errors:', validation.errors);
        throw new Error(`Invalid property data: ${validation.errors.join(', ')}`);
      }
      
      // Check for warnings about estimated data
      if (validation.warnings && validation.warnings.length > 0) {
        console.warn('Property data validation warnings:', validation.warnings);
        setHasDataWarnings(true);
        setDataWarnings(validation.warnings);
      }
      
      setPropertyData(mappedData);
      setLoading(false);
      
      // Auto-navigate after short delay
      setTimeout(() => {
        navigate('/confirmation');
      }, hasDataWarnings ? 3000 : 1500); // Longer delay if there are warnings

    } catch (err) {
      console.error('Property analysis error:', err);
      
      let errorMessage = 'Failed to analyze property. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('API key not configured')) {
          errorMessage = 'API configuration error. Please check your environment setup.';
        } else if (err.message.includes('Invalid API key')) {
          errorMessage = 'Invalid API key. Please verify your ATTOM API key configuration.';
        } else if (err.message.includes('rate limit')) {
          errorMessage = 'API rate limit exceeded. Please try again in a few minutes.';
        } else if (err.message.includes('Invalid address format')) {
          errorMessage = err.message;
        } else if (err.message.includes('Failed to search property')) {
          errorMessage = 'Unable to search for this property. Please check the address format and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsAddressNotFound(false);
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsAddressNotFound(false);
    setHasDataWarnings(false);
    setDataWarnings([]);
    setLoading(true);
    analyzeProperty();
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleTestApi = () => {
    navigate('/api-test');
  };

  const handleContinue = () => {
    navigate('/confirmation');
  };

  if (error) {
    return (
      <div className="min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressBar currentStep={0} totalSteps={4} steps={steps} />
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="mb-8">
              <div className={`${isAddressNotFound ? 'bg-amber-100' : 'bg-red-100'} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                {isAddressNotFound ? (
                  <MapPin className="w-10 h-10 text-amber-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                {isAddressNotFound ? 'Address Not Found' : 'Analysis Error'}
              </h1>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-lg font-medium text-gray-800">{searchAddress}</p>
              </div>
            </div>

            <div className={`${isAddressNotFound ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border rounded-lg p-6 mb-8`}>
              <div className="flex items-start space-x-3">
                {isAddressNotFound ? (
                  <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                )}
                <div className="text-left">
                  <h3 className={`font-semibold ${isAddressNotFound ? 'text-amber-900' : 'text-red-900'} mb-2`}>
                    {isAddressNotFound ? 'Property Not Found in Database' : 'Unable to Analyze Property'}
                  </h3>
                  <p className={`${isAddressNotFound ? 'text-amber-800' : 'text-red-800'}`}>{error}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Try Different Address
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
              >
                Retry Analysis
              </button>
              {isAddressNotFound && (
                <button
                  onClick={handleTestApi}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Test API Connection
                </button>
              )}
            </div>

            <div className={`p-4 ${isAddressNotFound ? 'bg-blue-50 border-blue-200' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
              <h3 className="font-semibold text-blue-900 mb-3">
                {isAddressNotFound ? 'Address Format Tips:' : 'Troubleshooting Tips:'}
              </h3>
              <ul className="text-left text-blue-800 text-sm space-y-2">
                {isAddressNotFound ? (
                  <>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Use full format:</strong> "123 Main Street, Springfield, IL" (include street, city, state)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Spell out abbreviations:</strong> Use "Street" instead of "St", "Avenue" instead of "Ave"</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Check spelling:</strong> Verify street names and city spelling are correct</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>New properties:</strong> Recently built homes may not be in the database yet</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Rural properties:</strong> Some rural or remote properties may have limited data</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li>• Make sure the address is complete (street, city, state)</li>
                    <li>• Try using the full street name (e.g., "Street" instead of "St")</li>
                    <li>• Verify the address exists and is spelled correctly</li>
                    <li>• Some newer properties may not be in the database yet</li>
                    <li>• Check your internet connection and try again</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={0} totalSteps={4} steps={steps} />
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {loading ? (
                <Search className="w-10 h-10 text-blue-600 animate-pulse" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {loading ? 'Analyzing Your Property' : 'Analysis Complete!'}
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-lg font-medium text-gray-800">{searchAddress}</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg text-gray-700">{status}</span>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">What we're analyzing:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  {[
                    'Current property assessment',
                    'Historical tax records',
                    'Recent comparable sales',
                    'Market value estimates',
                    'Assessment methodology',
                    'Appeal opportunities'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-lg text-green-800 font-medium">
                  Property analysis complete! We found your property data and identified potential appeal opportunities.
                </p>
              </div>
              
              {hasDataWarnings && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-6 h-6 text-amber-600 mt-1" />
                    <div className="text-left">
                      <h3 className="font-semibold text-amber-900 mb-2">Data Availability Notice</h3>
                      <p className="text-amber-800 mb-3">
                        We found your property but some information had to be estimated based on available data:
                      </p>
                      <ul className="text-amber-800 text-sm space-y-1">
                        {dataWarnings.map((warning, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-amber-600 mt-1">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-amber-800 text-sm mt-3">
                        <strong>Note:</strong> These estimates are based on typical property values and tax rates for your area. 
                        The analysis will still provide valuable insights for potential tax appeals.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleContinue}
                      className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Continue with Analysis
                    </button>
                  </div>
                </div>
              )}
              
              {!hasDataWarnings && (
                <p className="text-gray-600">
                  Redirecting you to confirm property details...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;