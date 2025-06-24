import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Home, 
  Calendar, 
  FileText, 
  Phone, 
  Mail,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  Database
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import ProgressBar from '../components/ProgressBar';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { propertyData, assessmentData } = useProperty();

  const steps = ['Analyze Property', 'Confirm Details', 'Assessment', 'Get Results'];

  React.useEffect(() => {
    if (!propertyData || !assessmentData) {
      navigate('/');
    }
  }, [propertyData, assessmentData, navigate]);

  if (!propertyData || !assessmentData) return null;

  // Calculate appeal potential and estimated savings
  const getAppealPotential = () => {
    if (assessmentData.taxSituation === 'significant') return 'HIGH';
    if (assessmentData.taxSituation === 'moderate') return 'MEDIUM';
    return 'LOW';
  };

  const getEstimatedSavings = () => {
    const baseReduction = assessmentData.taxSituation === 'significant' ? 0.35 : 
                         assessmentData.taxSituation === 'moderate' ? 0.25 : 0.15;
    return Math.round(propertyData.currentTax * baseReduction);
  };

  const appealPotential = getAppealPotential();
  const estimatedSavings = getEstimatedSavings();

  const potentialConfig = {
    HIGH: { 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50 border-green-200', 
      textColor: 'text-green-800',
      icon: CheckCircle
    },
    MEDIUM: { 
      color: 'bg-amber-500', 
      bgColor: 'bg-amber-50 border-amber-200', 
      textColor: 'text-amber-800',
      icon: AlertTriangle
    },
    LOW: { 
      color: 'bg-gray-500', 
      bgColor: 'bg-gray-50 border-gray-200', 
      textColor: 'text-gray-800',
      icon: FileText
    }
  };

  const config = potentialConfig[appealPotential as keyof typeof potentialConfig];

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={3} totalSteps={4} steps={steps} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">
            Your Property Tax Analysis
          </h1>
          <div className="bg-white rounded-lg p-4 inline-block shadow-sm border">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">{propertyData.address}</span>
            </div>
          </div>
        </div>

        {/* Main Results Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Estimated Savings */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-green-200">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimated Annual Savings</h3>
            <p className="text-4xl font-bold text-green-600 mb-2">${estimatedSavings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Based on successful appeal</p>
          </div>

          {/* Appeal Potential */}
          <div className={`bg-white rounded-2xl shadow-xl p-6 text-center border-2 ${config.bgColor.split(' ')[1]}`}>
            <div className={`${config.bgColor.split(' ')[0]}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <config.icon className={`w-8 h-8 ${config.textColor.replace('text-', 'text-').replace('-800', '-600')}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Appeal Potential</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${config.color} text-white font-semibold mb-2`}>
              {appealPotential}
            </div>
            <p className="text-sm text-gray-600">Success probability</p>
          </div>

          {/* Property Type */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-blue-200">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Type</h3>
            <p className="text-xl font-semibold text-blue-900 mb-2">{propertyData.propertyType}</p>
            <p className="text-sm text-gray-600">{propertyData.squareFootage.toLocaleString()} sq ft</p>
          </div>
        </div>

        {/* Data Quality Indicator */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
            <Database className="w-6 h-6 mr-2" />
            Data Quality & Sources
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Quality Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Data Quality: {propertyData.dataQuality.toUpperCase()}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assessment Data:</span>
                  <span className={`text-sm font-medium ${propertyData.hasRealAssessmentData ? 'text-green-600' : 'text-amber-600'}`}>
                    {propertyData.hasRealAssessmentData ? '✓ Real Data' : '⚠ Estimated'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Building Data:</span>
                  <span className={`text-sm font-medium ${propertyData.hasRealBuildingData ? 'text-green-600' : 'text-amber-600'}`}>
                    {propertyData.hasRealBuildingData ? '✓ Real Data' : '⚠ Estimated'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sale Data:</span>
                  <span className={`text-sm font-medium ${propertyData.hasRealSaleData ? 'text-green-600' : 'text-amber-600'}`}>
                    {propertyData.hasRealSaleData ? '✓ Real Data' : '⚠ Estimated'}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Source Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Data Sources</h4>
              <div className="space-y-2 text-sm">
                <p className="text-blue-800">
                  <strong>Primary Source:</strong> ATTOM Data API
                </p>
                <p className="text-blue-800">
                  <strong>Coverage:</strong> National property database
                </p>
                <p className="text-blue-800">
                  <strong>Update Frequency:</strong> Monthly
                </p>
                <p className="text-blue-800">
                  <strong>Accuracy:</strong> Varies by jurisdiction
                </p>
              </div>
            </div>
          </div>

          {/* Data Quality Explanation */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">About Data Quality</h4>
            <div className="text-sm text-amber-800 space-y-1">
              <p><strong>Excellent:</strong> Real assessment, building, and sale data available</p>
              <p><strong>Good:</strong> Real assessment data with some building or sale data</p>
              <p><strong>Fair:</strong> Some real data available, rest estimated</p>
              <p><strong>Poor:</strong> Limited real data, mostly estimated based on location averages</p>
              <p className="mt-2 text-xs">
                <strong>Note:</strong> Estimated values are based on location-specific averages and may not reflect your property's exact characteristics. 
                For the most accurate assessment, consider obtaining a professional property appraisal.
              </p>
              <p className="mt-2 text-xs">
                <strong>Improvement:</strong> Our estimation algorithms have been enhanced with 2024 market data and location-specific factors 
                to provide more realistic property valuations when real data is unavailable.
              </p>
            </div>
          </div>

          {/* Alternative Data Sources */}
          {propertyData.dataQuality === 'poor' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Getting More Accurate Data</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>For more accurate property data, consider these sources:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>County Assessor:</strong> Visit your local county assessor's website for official property records</li>
                  <li><strong>Professional Appraisal:</strong> Hire a licensed appraiser for the most accurate valuation</li>
                  <li><strong>Real Estate Agent:</strong> Get a comparative market analysis (CMA) from a local agent</li>
                  <li><strong>Zillow/Redfin:</strong> Check these platforms for additional property information</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Professional Tip:</strong> For tax appeals, county assessor data is typically the most authoritative source.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tax Analysis */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Tax Analysis
            </h3>
            
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-3">Year-over-Year Increase</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Previous</p>
                    <p className="text-lg font-bold">${propertyData.previousTax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current</p>
                    <p className="text-lg font-bold">${propertyData.currentTax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Increase</p>
                    <p className="text-lg font-bold text-red-600">+{propertyData.taxIncrease}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Assessment Comparison</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Assessment:</span>
                    <span className="font-medium">${propertyData.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Value Est:</span>
                    <span className="font-medium">${propertyData.marketValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sale Price:</span>
                    <span className="font-medium">${propertyData.lastSalePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property History */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Property History
            </h3>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Key Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{propertyData.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Footage:</span>
                    <span className="font-medium">{propertyData.squareFootage.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{assessmentData.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ownership:</span>
                    <span className="font-medium">{assessmentData.ownershipLength}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-3">Recent Changes</h4>
                <p className="text-amber-800 capitalize">
                  {assessmentData.recentChanges.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appeal Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            <Award className="w-7 h-7 mr-3" />
            Professional Recommendations
          </h3>
          
          <div className={`${config.bgColor} border-2 rounded-xl p-6 mb-6`}>
            <div className="flex items-start space-x-4">
              <config.icon className={`w-8 h-8 ${config.textColor.replace('-800', '-600')} mt-1`} />
              <div>
                <h4 className={`text-xl font-bold ${config.textColor} mb-2`}>
                  {appealPotential} Appeal Potential
                </h4>
                <p className={`${config.textColor} mb-4`}>
                  {appealPotential === 'HIGH' && "Your property shows strong indicators for a successful tax appeal. The significant tax increase combined with market analysis suggests excellent appeal potential."}
                  {appealPotential === 'MEDIUM' && "Your property shows good potential for tax savings. The moderate increase provides solid grounds for appeal with professional assistance."}
                  {appealPotential === 'LOW' && "While the tax increase is modest, there may still be opportunities for savings. Professional analysis is recommended to explore all options."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className={`font-semibold ${config.textColor} mb-2`}>Next Steps:</h5>
                    <ul className={`space-y-1 ${config.textColor} text-sm`}>
                      <li>• Professional property appraisal</li>
                      <li>• Comparable sales analysis</li>
                      <li>• Appeal documentation preparation</li>
                      <li>• Hearing representation</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className={`font-semibold ${config.textColor} mb-2`}>Timeline:</h5>
                    <ul className={`space-y-1 ${config.textColor} text-sm`}>
                      <li>• Initial consultation: 1-2 days</li>
                      <li>• Documentation: 1-2 weeks</li>
                      <li>• Appeal filing: 2-3 weeks</li>
                      <li>• Resolution: 2-4 months</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Guarantee */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Professional Guarantee</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-semibold">No Upfront Costs</p>
                <p className="text-sm text-gray-600">We only get paid when you save</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-semibold">78% Success Rate</p>
                <p className="text-sm text-gray-600">Professional representation</p>
              </div>
              <div className="flex flex-col items-center">
                <DollarSign className="w-8 h-8 text-amber-600 mb-2" />
                <p className="font-semibold">Average 25% Savings</p>
                <p className="text-sm text-gray-600">Proven results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Saving on Property Taxes?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Get professional help to appeal your property tax assessment and start saving money.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Start My Appeal Process</span>
            </button>
            <button className="bg-white text-blue-900 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Speak with Expert</span>
            </button>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="text-blue-200 hover:text-white underline transition-colors"
          >
            Analyze Another Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;