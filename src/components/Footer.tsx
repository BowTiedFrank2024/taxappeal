import React from 'react';
import { TrendingUp, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-amber-500 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">TaxAppealPro</span>
            </div>
            <p className="text-blue-200 mb-4">
              Professional property tax appeal services designed for appraisers and commercial property professionals. 
              Expand your services and generate additional revenue through property tax appeals.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@taxappealpro.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-blue-200">
              <li>Property Tax Appeals</li>
              <li>Assessment Analysis</li>
              <li>Market Valuations</li>
              <li>Professional Consulting</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-blue-200">
              <li>About Us</li>
              <li>Success Stories</li>
              <li>Professional Network</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © 2025 TaxAppealPro. All rights reserved. Licensed professionals only.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-blue-200 text-sm">Success Rate: 78%</span>
            <span className="text-blue-200 text-sm">•</span>
            <span className="text-blue-200 text-sm">Average Savings: 25%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;