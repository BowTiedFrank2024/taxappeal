import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, TrendingUp, DollarSign, Award, Users } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { setSearchAddress } = useProperty();
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setSearchAddress(address);
      navigate('/analysis');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              Property tax appeals,{' '}
              <span className="text-amber-500">simplified</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Get an instant, personalized property tax analysis. No login required. 
              Reduce your property taxes by 20-50% with professional help.
            </p>

            {/* Address Search */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your property address"
                  className="w-full px-6 py-4 pr-32 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Start Now</span>
                </button>
              </div>
            </form>

            {/* 3-Step Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Search, title: 'Analyze Your Property', desc: 'Instant property lookup and tax analysis' },
                { icon: CheckCircle, title: 'Get Personalized Plan', desc: 'Custom appeal strategy based on your situation' },
                { icon: DollarSign, title: 'Start Saving Money', desc: 'Professional appeal process, guaranteed results' }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tax Savings Examples */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Real Tax Savings Achieved
            </h2>
            <p className="text-xl text-gray-700">
              Our clients save thousands annually through professional property tax appeals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { savings: '$2,500+', desc: 'Average annual savings', icon: DollarSign, color: 'text-green-600' },
              { savings: '20-35%', desc: 'Average tax reduction', icon: TrendingUp, color: 'text-blue-600' },
              { savings: '$4,200', desc: 'Recent client saved on $180k property', icon: Award, color: 'text-amber-600' },
              { savings: '78%', desc: 'Success rate of appeals', icon: Users, color: 'text-teal-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className={`text-2xl font-bold ${stat.color} mb-2`}>{stat.savings}</div>
                <div className="text-gray-600">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appeal Potential Examples */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Know Your Appeal Potential
            </h2>
            <p className="text-xl text-gray-700">
              Properties with significant tax increases have the highest appeal success rates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                level: 'HIGH',
                color: 'bg-green-100 border-green-300 text-green-800',
                badge: 'bg-green-500',
                criteria: 'Properties with 20%+ tax increase',
                details: 'Recent comparable sales lower than assessment, strong appeal evidence'
              },
              {
                level: 'MEDIUM',
                color: 'bg-amber-100 border-amber-300 text-amber-800',
                badge: 'bg-amber-500',
                criteria: 'Properties with 10-20% tax increase',
                details: 'Some market evidence for appeal, moderate success probability'
              },
              {
                level: 'LOW',
                color: 'bg-gray-100 border-gray-300 text-gray-800',
                badge: 'bg-gray-500',
                criteria: 'Properties with <10% increase',
                details: 'Limited appeal evidence, exploring options recommended'
              }
            ].map((potential, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${potential.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${potential.badge}`}>
                    {potential.level} POTENTIAL
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{potential.criteria}</h3>
                <p className="text-sm opacity-80">{potential.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-700">
              Real results from property owners who successfully appealed their tax assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                property: 'Commercial Office Building',
                location: 'Downtown Dallas, TX',
                before: '$8,400',
                after: '$5,200',
                savings: '$3,200',
                percentage: '38%'
              },
              {
                property: 'Single Family Residence',
                location: 'Austin, TX',
                before: '$4,800',
                after: '$3,400',
                savings: '$1,400',
                percentage: '29%'
              },
              {
                property: 'Investment Property',
                location: 'Houston, TX',
                before: '$6,200',
                after: '$4,100',
                savings: '$2,100',
                percentage: '34%'
              }
            ].map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">{story.property}</h3>
                <p className="text-sm text-gray-600 mb-4">{story.location}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Before:</span>
                    <span className="font-medium">{story.before}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">After:</span>
                    <span className="font-medium">{story.after}/year</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">Annual Savings:</span>
                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">{story.savings}</div>
                      <div className="text-green-600 text-sm">{story.percentage} reduction</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section id="professionals" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                For Property Professionals
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Designed for appraisers, commercial property professionals, and tax consultants who want to 
                expand their services and generate additional revenue through property tax appeals.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4 text-amber-400">Revenue Opportunities</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Percentage of tax savings achieved</li>
                    <li>• No upfront costs to property owners</li>
                    <li>• Recurring annual revenue potential</li>
                    <li>• Professional referral network</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4 text-amber-400">Professional Support</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Licensed appraiser network</li>
                    <li>• Tax law expertise</li>
                    <li>• Streamlined appeal process</li>
                    <li>• Professional credentials</li>
                  </ul>
                </div>
              </div>
              
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                Join Professional Network
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;