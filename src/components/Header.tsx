import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-900 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xl font-bold text-blue-900">TaxAppealPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-900 transition-colors">
              How It Works
            </a>
            <a href="#success-stories" className="text-gray-700 hover:text-blue-900 transition-colors">
              Success Stories
            </a>
            <a href="#professionals" className="text-gray-700 hover:text-blue-900 transition-colors">
              For Professionals
            </a>
            <Link to="/api-test" className="text-gray-700 hover:text-blue-900 transition-colors">
              API Test
            </Link>
            <a href="#contact" className="text-gray-700 hover:text-blue-900 transition-colors">
              Contact
            </a>
            <Link
              to="/"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-900 transition-colors">
                How It Works
              </a>
              <a href="#success-stories" className="text-gray-700 hover:text-blue-900 transition-colors">
                Success Stories
              </a>
              <a href="#professionals" className="text-gray-700 hover:text-blue-900 transition-colors">
                For Professionals
              </a>
              <Link to="/api-test" className="text-gray-700 hover:text-blue-900 transition-colors">
                API Test
              </Link>
              <a href="#contact" className="text-gray-700 hover:text-blue-900 transition-colors">
                Contact
              </a>
              <Link
                to="/"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-center"
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;