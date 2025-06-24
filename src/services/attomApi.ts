export interface AttomPropertyData {
  identifier?: {
    attomId?: string;
    fips?: string;
  };
  address?: {
    oneLine?: string;
    line1?: string;
    line2?: string;
    locality?: string;
    countrySubd?: string;
    postal1?: string;
  };
  lot?: {
    lotSize1?: number;
    lotSize2?: number;
  };
  building?: {
    size?: {
      bldgSize?: number;
      grossSize?: number;
      grossSizeAdjusted?: number;
      livingSize?: number;
    };
    construction?: {
      yearBuilt?: number;
      yearBuiltEffective?: number;
    };
    summary?: {
      bldgType?: string;
      levels?: number;
      unitsCount?: number;
    };
  };
  assessment?: {
    assessed?: {
      assdTtlValue?: number;
      assdLandValue?: number;
      assdImpValue?: number;
    };
    market?: {
      mktTtlValue?: number;
      mktLandValue?: number;
      mktImpValue?: number;
    };
    tax?: {
      taxAmt?: number;
      taxYear?: number;
    };
  };
  sale?: {
    amount?: {
      saleAmt?: number;
      saleAmtStndCode?: string;
    };
    calculation?: {
      pricePerSqft?: number;
    };
    salesSearchDate?: string;
    transDate?: string;
  };
  avm?: {
    amount?: {
      value?: number;
    };
    eventDate?: string;
  };
}

export interface AttomApiResponse {
  status: {
    version: string;
    code: number;
    msg: string;
    total: number;
    responseDateTime: string;
    transactionID: string;
  };
  property?: AttomPropertyData[];
}

export interface AttomDetailResponse {
  status: {
    version: string;
    code: number;
    msg: string;
    total: number;
    responseDateTime: string;
    transactionID: string;
  };
  property?: AttomPropertyData[];
}

class AttomApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ATTOM_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.gateway.attomdata.com';
    
    if (!this.apiKey) {
      console.warn('ATTOM API key not found. Please add VITE_ATTOM_API_KEY to your .env file');
    }
  }

  private parseAddress(address: string) {
    // Remove extra whitespace and normalize
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    
    // Split by comma and clean each part
    const addressParts = cleanAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
    
    if (addressParts.length === 0) {
      throw new Error('Invalid address format. Please enter a complete address.');
    }
    
    // Handle different address formats
    let streetAddress = '';
    let city = '';
    let state = '';
    let zipCode = '';
    
    if (addressParts.length === 1) {
      // Single part - assume it's just street address
      streetAddress = addressParts[0];
    } else if (addressParts.length === 2) {
      // Two parts - street address and city/state
      streetAddress = addressParts[0];
      const cityStatePart = addressParts[1];
      
      // Try to extract state from the end (2-3 letter state code)
      const stateMatch = cityStatePart.match(/\s([A-Z]{2,3})\s*(\d{5}(-\d{4})?)?$/);
      if (stateMatch) {
        state = stateMatch[1];
        city = cityStatePart.substring(0, stateMatch.index).trim();
        zipCode = stateMatch[2] || '';
      } else {
        city = cityStatePart;
      }
    } else if (addressParts.length >= 3) {
      // Three or more parts - street, city, state, zip
      streetAddress = addressParts[0];
      city = addressParts[1];
      
      // Handle state and zip code
      const stateZipPart = addressParts[2];
      const stateZipMatch = stateZipPart.match(/^([A-Z]{2,3})\s*(\d{5}(-\d{4})?)?$/);
      
      if (stateZipMatch) {
        state = stateZipMatch[1];
        zipCode = stateZipMatch[2] || '';
      } else {
        // Try to extract state from the end
        const stateMatch = stateZipPart.match(/\s([A-Z]{2,3})\s*(\d{5}(-\d{4})?)?$/);
        if (stateMatch) {
          state = stateMatch[1];
          city = city + ' ' + stateZipPart.substring(0, stateMatch.index).trim();
          zipCode = stateMatch[2] || '';
        } else {
          city = city + ', ' + stateZipPart;
        }
      }
      
      // If we have more parts, they might be additional city/state info
      if (addressParts.length > 3) {
        const additionalParts = addressParts.slice(3).join(', ');
        if (!state) {
          // Try to extract state from additional parts
          const additionalStateMatch = additionalParts.match(/\s([A-Z]{2,3})\s*(\d{5}(-\d{4})?)?$/);
          if (additionalStateMatch) {
            state = additionalStateMatch[1];
            city = city + ', ' + additionalParts.substring(0, additionalStateMatch.index).trim();
            zipCode = additionalStateMatch[2] || '';
          } else {
            city = city + ', ' + additionalParts;
          }
        } else {
          city = city + ', ' + additionalParts;
        }
      }
    }
    
    // Validate that we have at least street address and city
    if (!streetAddress || !city) {
      throw new Error('Please provide a complete address including street address and city.');
    }
    
    console.log('Parsed address:', { streetAddress, city, state, zipCode });
    
    return { streetAddress, city, state, zipCode };
  }

  async searchProperty(address: string): Promise<AttomApiResponse> {
    if (!this.apiKey) {
      throw new Error('ATTOM API key not configured. Please add VITE_ATTOM_API_KEY to your .env file');
    }

    try {
      const { streetAddress, city, state, zipCode } = this.parseAddress(address);
      
      // According to ATTOM API docs: /propertyapi/v1.0.0/property/address
      const searchUrl = `${this.baseUrl}/propertyapi/v1.0.0/property/address`;
      const params = new URLSearchParams({
        address1: streetAddress,
        address2: city + (state ? `, ${state}` : '') + (zipCode ? ` ${zipCode}` : ''),
        format: 'json'
      });

      console.log('Making API request to:', `${searchUrl}?${params}`);

      const response = await fetch(`${searchUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apikey': this.apiKey
        }
      });

      const responseText = await response.text();
      console.log('API Response status:', response.status);
      console.log('API Response text:', responseText);
      
      let data: AttomApiResponse;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Failed to parse API response: ${responseText}`);
      }

      // Handle specific case where API returns 400 with "SuccessWithoutResult"
      if (!response.ok) {
        if (response.status === 400 && data.status?.msg === 'SuccessWithoutResult') {
          // This is not an error - it means no results were found
          return data;
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your VITE_ATTOM_API_KEY configuration.');
        } else if (response.status === 403) {
          throw new Error('API access denied. Please check your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        } else {
          throw new Error(`API Error: ${response.status} - ${response.statusText}\nResponse: ${responseText}`);
        }
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid address format')) {
        throw error;
      }
      console.error('Property search error:', error);
      throw new Error(`Failed to search property: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPropertyDetails(attomId: string): Promise<AttomDetailResponse> {
    if (!this.apiKey) {
      throw new Error('ATTOM API key not configured. Please add VITE_ATTOM_API_KEY to your .env file');
    }

    try {
      // According to ATTOM API docs: /propertyapi/v1.0.0/property/detail
      const detailUrl = `${this.baseUrl}/propertyapi/v1.0.0/property/detail`;
      const params = new URLSearchParams({
        attomid: attomId,
        format: 'json'
      });

      console.log('Making property detail request to:', `${detailUrl}?${params}`);

      const response = await fetch(`${detailUrl}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'apikey': this.apiKey
        }
      });

      const responseText = await response.text();
      console.log('Detail API Response status:', response.status);
      
      let data: AttomDetailResponse;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Failed to parse detail API response: ${responseText}`);
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your VITE_ATTOM_API_KEY configuration.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        } else if (response.status === 403) {
          throw new Error('API access denied. Please check your API key permissions.');
        } else {
          throw new Error(`Detail API Error: ${response.status} - ${response.statusText}\nResponse: ${responseText}`);
        }
      }

      return data;
    } catch (error) {
      console.error('Property detail error:', error);
      throw new Error(`Failed to get property details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFullPropertyData(address: string) {
    const searchResult = await this.searchProperty(address);
    
    if (!searchResult.property || searchResult.property.length === 0) {
      return { search: searchResult, detail: null };
    }

    const property = searchResult.property[0];
    const attomId = property.identifier?.attomId;
    
    if (!attomId) {
      return { search: searchResult, detail: null };
    }

    try {
      const detailResult = await this.getPropertyDetails(attomId);
      return { search: searchResult, detail: detailResult };
    } catch (error) {
      console.warn('Failed to fetch property details:', error);
      return { search: searchResult, detail: null };
    }
  }
}

export const attomApiService = new AttomApiService();