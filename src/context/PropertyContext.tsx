import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PropertyData {
  address: string;
  propertyType: string;
  currentValue: number;
  previousValue: number;
  currentTax: number;
  previousTax: number;
  taxIncrease: number;
  marketValue: number;
  squareFootage: number;
  yearBuilt: number;
  lastSalePrice: number;
  lastSaleDate: string;
}

interface AssessmentData {
  taxSituation: string;
  propertyType: string;
  ownershipLength: string;
  recentChanges: string;
}

interface PropertyContextType {
  propertyData: PropertyData | null;
  assessmentData: AssessmentData | null;
  searchAddress: string;
  setPropertyData: (data: PropertyData) => void;
  setAssessmentData: (data: AssessmentData) => void;
  setSearchAddress: (address: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [searchAddress, setSearchAddress] = useState('');

  return (
    <PropertyContext.Provider value={{
      propertyData,
      assessmentData,
      searchAddress,
      setPropertyData,
      setAssessmentData,
      setSearchAddress,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};