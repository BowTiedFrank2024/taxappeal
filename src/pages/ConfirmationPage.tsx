import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import ProgressBar from '../components/ProgressBar';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { propertyData } = useProperty();

  const steps = ['Analyze Property', 'Confirm Details', 'Assessment', 'Get Results'];

  React.useEffect(() => {
    if (!propertyData) {
      navigate('/');
    }
  }, [propertyData, navigate]);

  if (!propertyData) return null;

  const handleConfirm = () => {
    navigate('/assessment');
  };

  const handleEdit = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={1} totalSteps={4} steps={steps} />
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Confirm Property Details
            </h1>
            <p className="text-xl text-gray-700">
              Please verify that this information matches your property
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Address */}
              <div className="md:col-span-2">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Property Address</h3>
                    <p className="text-lg text-gray-800">{propertyData.address}</p>
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="flex items-start space-x-3">
                <Home className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Property Type</h3>
                  <p className="text-gray-700">{propertyData.propertyType}</p>
                </div>
              </div>

              {/* Year Built */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Year Built</h3>
                  <p className="text-gray-700">{propertyData.yearBuilt}</p>
                </div>
              </div>

              {/* Square Footage */}
              <div className="flex items-start space-x-3">
                <Home className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Square Footage</h3>
                  <p className="text-gray-700">{propertyData.squareFootage.toLocaleString()} sq ft</p>
                </div>
              </div>

              {/* Last Sale */}
              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Last Sale</h3>
                  <p className="text-gray-700">
                    ${propertyData.lastSalePrice.toLocaleString()} ({new Date(propertyData.lastSaleDate).toLocaleDateString()})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Information Highlight */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Tax Increase Alert</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Previous Tax</p>
                <p className="text-xl font-bold text-gray-900">${propertyData.previousTax.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Tax</p>
                <p className="text-xl font-bold text-gray-900">${propertyData.currentTax.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Increase</p>
                <p className="text-xl font-bold text-red-600">+{propertyData.taxIncrease}%</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleEdit}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Edit Address
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
            >
              Yes, this looks right
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;