import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import ProgressBar from '../components/ProgressBar';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const { propertyData, setAssessmentData } = useProperty();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    taxSituation: '',
    propertyType: '',
    ownershipLength: '',
    recentChanges: ''
  });

  const steps = ['Analyze Property', 'Confirm Details', 'Assessment', 'Get Results'];

  React.useEffect(() => {
    if (!propertyData) {
      navigate('/');
    }
  }, [propertyData, navigate]);

  const questions = [
    {
      key: 'taxSituation',
      title: 'What is your tax situation?',
      subtitle: 'Help us understand your current property tax increase',
      options: [
        { value: 'significant', label: 'Significant tax increase (20%+ this year)', highlight: true },
        { value: 'moderate', label: 'Moderate tax increase (10-20% this year)' },
        { value: 'small', label: 'Small tax increase (5-10% this year)' },
        { value: 'exploring', label: 'No significant increase, just exploring options' }
      ]
    },
    {
      key: 'propertyType',
      title: 'What type of property is this?',
      subtitle: 'This helps us tailor the appeal strategy',
      options: [
        { value: 'primary', label: 'Primary Residence' },
        { value: 'investment', label: 'Investment Property' },
        { value: 'commercial', label: 'Commercial Property' },
        { value: 'vacation', label: 'Vacation Home' },
        { value: 'rental', label: 'Rental Property' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      key: 'ownershipLength',
      title: 'How long have you owned this property?',
      subtitle: 'Ownership history affects appeal strategy',
      options: [
        { value: 'under1', label: 'Less than 1 year' },
        { value: '1-3', label: '1-3 years' },
        { value: '4-7', label: '4-7 years' },
        { value: '8-15', label: '8-15 years' },
        { value: '16-25', label: '16-25 years' },
        { value: 'over25', label: 'More than 25 years' }
      ]
    },
    {
      key: 'recentChanges',
      title: 'Any recent changes to the property?',
      subtitle: 'Improvements or issues can affect assessment',
      options: [
        { value: 'major', label: 'Major renovations or additions' },
        { value: 'minor', label: 'Minor improvements only' },
        { value: 'none', label: 'No recent changes' },
        { value: 'damage', label: 'Property damage or issues' }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].key]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete
      setAssessmentData(newAnswers);
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigate('/confirmation');
    }
  };

  if (!propertyData) return null;

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={2} totalSteps={4} steps={steps} />
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Question Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-blue-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {currentQ.title}
            </h1>
            <p className="text-xl text-gray-700">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                  option.highlight 
                    ? 'border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-100' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-medium ${
                    option.highlight ? 'text-amber-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </span>
                  <ChevronRight className={`w-5 h-5 ${
                    option.highlight ? 'text-amber-600' : 'text-gray-400'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Back
            </button>
            <div className="text-sm text-gray-500 flex items-center">
              Click any option to continue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;