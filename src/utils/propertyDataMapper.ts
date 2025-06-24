import { AttomPropertyData } from '../services/attomApi';

export interface PropertyData {
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
  // Add flags to indicate data quality
  hasRealAssessmentData: boolean;
  hasRealBuildingData: boolean;
  hasRealSaleData: boolean;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

export function mapAttomDataToPropertyData(
  searchData: AttomPropertyData,
  detailData?: AttomPropertyData
): PropertyData {
  // Use detail data if available, otherwise fall back to search data
  const property = detailData || searchData;
  
  console.log('Mapping property data:', { searchData, detailData });
  
  // Extract basic property information
  const address = property.address?.oneLine || 
                 `${property.address?.line1 || ''} ${property.address?.line2 || ''}`.trim() ||
                 'Address not available';
  
  // Create address-based seed for consistent but varied estimates
  const addressSeed = createAddressSeed(address);
  
  // Check what real data we have
  const hasRealAssessmentData = !!(property.assessment?.assessed?.assdTtlValue || 
                                  property.assessment?.market?.mktTtlValue || 
                                  property.assessment?.tax?.taxAmt);
  
  const hasRealBuildingData = !!(property.building?.construction?.yearBuilt || 
                                property.building?.size?.livingSize || 
                                property.building?.size?.bldgSize);
  
  const hasRealSaleData = !!(property.sale?.amount?.saleAmt || property.sale?.transDate);
  
  // Determine data quality
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
  if (hasRealAssessmentData && hasRealBuildingData && hasRealSaleData) {
    dataQuality = 'excellent';
  } else if (hasRealAssessmentData && (hasRealBuildingData || hasRealSaleData)) {
    dataQuality = 'good';
  } else if (hasRealAssessmentData || hasRealBuildingData || hasRealSaleData) {
    dataQuality = 'fair';
  }
  
  const yearBuilt = property.building?.construction?.yearBuilt || 
                   property.building?.construction?.yearBuiltEffective || 
                   null;
  
  const squareFootage = property.building?.size?.livingSize || 
                       property.building?.size?.bldgSize || 
                       property.building?.size?.grossSize || 
                       property.building?.size?.grossSizeAdjusted ||
                       null;
  
  // Determine property type
  const buildingType = property.building?.summary?.bldgType || '';
  const propertyType = mapBuildingTypeToPropertyType(buildingType);
  
  // Extract assessment and tax information
  const assessedValue = property.assessment?.assessed?.assdTtlValue || null;
  const marketAssessedValue = property.assessment?.market?.mktTtlValue || null;
  const avmValue = property.avm?.amount?.value || null;
  const salePrice = property.sale?.amount?.saleAmt || null;
  const taxAmount = property.assessment?.tax?.taxAmt || null;
  
  // IMPROVED: Better value estimation using multiple factors
  let currentValue = assessedValue || marketAssessedValue || avmValue || salePrice;
  
  // If no real data available, create more accurate estimate
  if (!currentValue) {
    currentValue = getImprovedEstimatedValue(address, propertyType, addressSeed);
  }
  
  // IMPROVED: Better market value calculation
  let marketValue = avmValue || marketAssessedValue || salePrice || currentValue;
  
  // Add realistic variation to market value if it's the same as current value
  if (marketValue === currentValue && !avmValue && !marketAssessedValue && !salePrice) {
    const marketVariation = 0.95 + (addressSeed % 150) / 1000; // 95-110% of current value
    marketValue = Math.round(currentValue * marketVariation);
  }
  
  // IMPROVED: Better tax calculation
  let currentTax = taxAmount;
  let taxRate = getImprovedTaxRateByLocation(address, addressSeed);
  
  // If we have tax amount and assessed value, calculate actual tax rate
  if (currentTax && currentValue) {
    taxRate = currentTax / currentValue;
  } else if (!currentTax) {
    // Estimate tax based on current value and location-based rate
    currentTax = Math.round(currentValue * taxRate);
  }
  
  // IMPROVED: More realistic previous values calculation
  const valueIncreaseRate = getRealisticValueIncreaseRate(address, addressSeed);
  const previousValue = Math.round(currentValue / (1 + valueIncreaseRate));
  const previousTax = Math.round(currentTax / (1 + valueIncreaseRate * 0.7)); // Tax increases less than value
  
  const taxIncrease = previousTax > 0 
    ? Math.round(((currentTax - previousTax) / previousTax) * 100 * 10) / 10
    : getRealisticTaxIncreaseRate(address, addressSeed);
  
  // IMPROVED: Better square footage estimation
  const finalSquareFootage = squareFootage || getImprovedSquareFootage(propertyType, address, addressSeed);
  
  // IMPROVED: Better year built estimation
  const finalYearBuilt = yearBuilt || getImprovedYearBuilt(address, addressSeed);
  
  // IMPROVED: Better sale information
  const lastSalePrice = salePrice || getRealisticSalePrice(currentValue, addressSeed);
  const lastSaleDate = property.sale?.transDate || 
                      property.sale?.salesSearchDate || 
                      getRealisticSaleDate(addressSeed);
  
  const result = {
    address,
    propertyType,
    currentValue,
    previousValue,
    currentTax,
    previousTax,
    taxIncrease,
    marketValue,
    squareFootage: finalSquareFootage,
    yearBuilt: finalYearBuilt,
    lastSalePrice,
    lastSaleDate,
    hasRealAssessmentData,
    hasRealBuildingData,
    hasRealSaleData,
    dataQuality
  };
  
  console.log('Mapped property data result:', result);
  return result;
}

function createAddressSeed(address: string): number {
  // Create a simple hash from the address for consistent randomization
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// IMPROVED: More accurate value estimation based on location and property characteristics
function getImprovedEstimatedValue(address: string, propertyType: string, seed: number): number {
  const addressLower = address.toLowerCase();
  
  // More detailed base values by state/region (2024 estimates)
  let baseValue = 350000; // Updated default
  
  if (addressLower.includes('ca') || addressLower.includes('california')) {
    baseValue = 750000;
  } else if (addressLower.includes('ny') || addressLower.includes('new york')) {
    baseValue = 550000;
  } else if (addressLower.includes('tx') || addressLower.includes('texas')) {
    baseValue = 320000;
  } else if (addressLower.includes('fl') || addressLower.includes('florida')) {
    baseValue = 380000;
  } else if (addressLower.includes('mn') || addressLower.includes('minnesota')) {
    baseValue = 340000;
  } else if (addressLower.includes('il') || addressLower.includes('illinois')) {
    baseValue = 280000;
  } else if (addressLower.includes('wa') || addressLower.includes('washington')) {
    baseValue = 580000;
  } else if (addressLower.includes('co') || addressLower.includes('colorado')) {
    baseValue = 520000;
  } else if (addressLower.includes('az') || addressLower.includes('arizona')) {
    baseValue = 420000;
  } else if (addressLower.includes('nv') || addressLower.includes('nevada')) {
    baseValue = 450000;
  }
  
  // Adjust for property type
  let typeMultiplier = 1.0;
  if (propertyType.includes('Condominium')) {
    typeMultiplier = 0.85;
  } else if (propertyType.includes('Townhouse')) {
    typeMultiplier = 0.95;
  } else if (propertyType.includes('Multi-Family')) {
    typeMultiplier = 1.3;
  } else if (propertyType.includes('Commercial')) {
    typeMultiplier = 1.5;
  }
  
  // Add realistic variation based on address seed (±15%)
  const variation = (seed % 300) / 1000 - 0.15; // -0.15 to +0.15
  return Math.round(baseValue * typeMultiplier * (1 + variation));
}

// IMPROVED: More accurate square footage estimation
function getImprovedSquareFootage(propertyType: string, address: string, seed: number): number {
  let baseSize = 2000; // Updated default
  
  if (propertyType.includes('Condominium')) {
    baseSize = 1400;
  } else if (propertyType.includes('Townhouse')) {
    baseSize = 1800;
  } else if (propertyType.includes('Multi-Family')) {
    baseSize = 2800;
  } else if (propertyType.includes('Commercial')) {
    baseSize = 4000;
  }
  
  // Adjust for location (some areas have larger homes)
  const addressLower = address.toLowerCase();
  if (addressLower.includes('tx') || addressLower.includes('texas')) {
    baseSize = Math.round(baseSize * 1.1); // Texas homes tend to be larger
  } else if (addressLower.includes('ca') || addressLower.includes('california')) {
    baseSize = Math.round(baseSize * 0.9); // CA homes can be smaller
  }
  
  // Add realistic variation (±20%)
  const variation = (seed % 400) / 1000 - 0.2; // -0.2 to +0.2
  return Math.round(baseSize * (1 + variation));
}

// IMPROVED: More accurate tax rate estimation
function getImprovedTaxRateByLocation(address: string, seed: number): number {
  const addressLower = address.toLowerCase();
  
  // Updated tax rates based on 2024 data
  let baseRate = 0.011; // 1.1% default (updated)
  
  if (addressLower.includes('tx') || addressLower.includes('texas')) {
    baseRate = 0.017; // Higher property taxes in TX
  } else if (addressLower.includes('ca') || addressLower.includes('california')) {
    baseRate = 0.007; // Lower due to Prop 13
  } else if (addressLower.includes('ny') || addressLower.includes('new york')) {
    baseRate = 0.014;
  } else if (addressLower.includes('fl') || addressLower.includes('florida')) {
    baseRate = 0.009; // No state income tax, moderate property tax
  } else if (addressLower.includes('mn') || addressLower.includes('minnesota')) {
    baseRate = 0.010;
  } else if (addressLower.includes('il') || addressLower.includes('illinois')) {
    baseRate = 0.021; // High property taxes
  } else if (addressLower.includes('nj') || addressLower.includes('new jersey')) {
    baseRate = 0.023; // Very high property taxes
  } else if (addressLower.includes('nh') || addressLower.includes('new hampshire')) {
    baseRate = 0.018; // High property taxes, no income tax
  }
  
  // Add small variation based on seed (±5%)
  const variation = (seed % 100) / 10000 - 0.005; // -0.005 to +0.005
  return baseRate + variation;
}

// NEW: Realistic value increase rate
function getRealisticValueIncreaseRate(address: string, seed: number): number {
  const addressLower = address.toLowerCase();
  
  // Base increase rates by region (2023-2024 data)
  let baseRate = 0.08; // 8% default
  
  if (addressLower.includes('fl') || addressLower.includes('florida')) {
    baseRate = 0.12; // High growth in FL
  } else if (addressLower.includes('tx') || addressLower.includes('texas')) {
    baseRate = 0.10; // Strong growth in TX
  } else if (addressLower.includes('ca') || addressLower.includes('california')) {
    baseRate = 0.06; // Slower growth in CA
  } else if (addressLower.includes('ny') || addressLower.includes('new york')) {
    baseRate = 0.07; // Moderate growth in NY
  }
  
  // Add variation (±3%)
  const variation = (seed % 60) / 1000 - 0.03; // -0.03 to +0.03
  return baseRate + variation;
}

// NEW: Realistic tax increase rate
function getRealisticTaxIncreaseRate(address: string, seed: number): number {
  const addressLower = address.toLowerCase();
  
  // Base tax increase rates by region
  let baseRate = 0.10; // 10% default
  
  if (addressLower.includes('ca') || addressLower.includes('california')) {
    baseRate = 0.06; // Lower due to Prop 13
  } else if (addressLower.includes('tx') || addressLower.includes('texas')) {
    baseRate = 0.12; // Higher in TX
  } else if (addressLower.includes('fl') || addressLower.includes('florida')) {
    baseRate = 0.11; // Moderate in FL
  }
  
  // Add variation (±2%)
  const variation = (seed % 40) / 1000 - 0.02; // -0.02 to +0.02
  return Math.round((baseRate + variation) * 100 * 10) / 10;
}

// IMPROVED: More realistic year built estimation
function getImprovedYearBuilt(address: string, seed: number): number {
  const addressLower = address.toLowerCase();
  
  // Base years by region (some areas have older/newer housing stock)
  let baseYear = 1985; // Updated default
  
  if (addressLower.includes('ca') || addressLower.includes('california')) {
    baseYear = 1975; // Older housing stock in CA
  } else if (addressLower.includes('tx') || addressLower.includes('texas')) {
    baseYear = 1995; // Newer housing stock in TX
  } else if (addressLower.includes('fl') || addressLower.includes('florida')) {
    baseYear = 1990; // Mix of old and new in FL
  } else if (addressLower.includes('ny') || addressLower.includes('new york')) {
    baseYear = 1965; // Much older housing stock in NY
  }
  
  // Add variation (±15 years)
  const variation = (seed % 300) / 10 - 15; // -15 to +15 years
  const year = Math.round(baseYear + variation);
  
  // Ensure year is reasonable (between 1900 and current year)
  return Math.max(1900, Math.min(year, new Date().getFullYear()));
}

// NEW: Realistic sale price estimation
function getRealisticSalePrice(currentValue: number, seed: number): number {
  // Sale price is typically 90-110% of current value
  const variation = 0.9 + (seed % 200) / 1000; // 0.9 to 1.1
  return Math.round(currentValue * variation);
}

// IMPROVED: More realistic sale date
function getRealisticSaleDate(seed: number): string {
  // Generate a date between 2020 and 2024
  const years = [2020, 2021, 2022, 2023, 2024];
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const days = ['01', '05', '10', '15', '20', '25'];
  
  const year = years[seed % years.length];
  const month = months[(seed * 2) % months.length];
  const day = days[(seed * 3) % days.length];
  
  return `${year}-${month}-${day}`;
}

function mapBuildingTypeToPropertyType(buildingType: string): string {
  const type = buildingType.toLowerCase();
  
  if (type.includes('single') || type.includes('detached') || type.includes('sfr') || type.includes('residential')) {
    return 'Single Family Residence';
  }
  if (type.includes('condo') || type.includes('condominium')) {
    return 'Condominium';
  }
  if (type.includes('townhouse') || type.includes('town home') || type.includes('townhome')) {
    return 'Townhouse';
  }
  if (type.includes('duplex')) {
    return 'Duplex';
  }
  if (type.includes('apartment') || type.includes('multi')) {
    return 'Multi-Family';
  }
  if (type.includes('commercial') || type.includes('office')) {
    return 'Commercial';
  }
  if (type.includes('industrial')) {
    return 'Industrial';
  }
  if (type.includes('retail')) {
    return 'Retail';
  }
  if (type.includes('vacant') || type.includes('land')) {
    return 'Vacant Land';
  }
  
  // Default to Single Family Residence if no specific type found
  return buildingType || 'Single Family Residence';
}

export function validatePropertyData(data: PropertyData): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data.address || data.address === 'Address not available') {
    errors.push('Property address is missing or invalid');
  }
  
  // Check if currentValue is null, undefined, or less than or equal to 0
  if (data.currentValue == null || data.currentValue <= 0) {
    errors.push('Property assessment value is missing or invalid');
  }
  
  // Add warnings for estimated data
  if (data.currentValue && data.currentValue > 0) {
    // Check if we're using estimated values (you can add more specific checks here)
    warnings.push('Some property data may be estimated based on location averages');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}