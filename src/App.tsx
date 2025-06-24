import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import ApiTestPage from './pages/ApiTestPage';
import { PropertyProvider } from './context/PropertyContext';

function App() {
  return (
    <PropertyProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/api-test" element={<ApiTestPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PropertyProvider>
  );
}

export default App;