# ATTOM Data API Reference

This document provides a reference for the ATTOM Data API endpoints used in this application, based on the official documentation at https://api.developer.attomdata.com/docs#/

## Base URL
```
https://api.gateway.attomdata.com
```

## Authentication
All API requests require an `apikey` header with your ATTOM Data API key.

## Endpoints Used

### 1. Property Search by Address
**Endpoint:** `GET /propertyapi/v1.0.0/property/address`

**Purpose:** Search for properties by address to get basic property information and ATTOM ID.

**Parameters:**
- `address1` (required): Street address (e.g., "123 Main Street")
- `address2` (required): City, State, ZIP (e.g., "Austin, TX 78701")
- `postalcode` (optional): ZIP code for more precise results
- `format` (optional): Response format, defaults to "json"

**Example Request:**
```
GET /propertyapi/v1.0.0/property/address?address1=123%20Main%20Street&address2=Austin%2C%20TX&format=json
```

**Response Structure:**
```json
{
  "status": {
    "version": "1.0.0",
    "code": 0,
    "msg": "Success",
    "total": 1,
    "responseDateTime": "2024-01-01T12:00:00Z",
    "transactionID": "abc123"
  },
  "property": [
    {
      "identifier": {
        "attomId": "123456789",
        "fips": "48453"
      },
      "address": {
        "oneLine": "123 Main Street, Austin, TX 78701",
        "line1": "123 Main Street",
        "locality": "Austin",
        "countrySubd": "TX",
        "postal1": "78701"
      },
      "lot": {
        "lotSize1": 5000
      },
      "building": {
        "size": {
          "bldgSize": 2000,
          "livingSize": 1800
        },
        "construction": {
          "yearBuilt": 1995
        },
        "summary": {
          "bldgType": "Single Family"
        }
      },
      "assessment": {
        "assessed": {
          "assdTtlValue": 350000
        },
        "market": {
          "mktTtlValue": 375000
        },
        "tax": {
          "taxAmt": 8750,
          "taxYear": 2023
        }
      },
      "sale": {
        "amount": {
          "saleAmt": 320000
        },
        "transDate": "2022-06-15"
      },
      "avm": {
        "amount": {
          "value": 380000
        },
        "eventDate": "2024-01-01"
      }
    }
  ]
}
```

### 2. Property Details by ATTOM ID
**Endpoint:** `GET /propertyapi/v1.0.0/property/detail`

**Purpose:** Get detailed property information using the ATTOM ID from the search results.

**Parameters:**
- `attomid` (required): ATTOM property ID from search results
- `format` (optional): Response format, defaults to "json"

**Example Request:**
```
GET /propertyapi/v1.0.0/property/detail?attomid=123456789&format=json
```

**Response Structure:**
Similar to search response but with more detailed information including:
- Comprehensive building details
- Historical sales data
- Tax assessment history
- Property characteristics
- Neighborhood information

## Error Codes

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (may include "SuccessWithoutResult" for no matches)
- `401`: Unauthorized (invalid API key)
- `403`: Forbidden (insufficient permissions)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

### Response Status Codes
- `0`: Success
- `1`: Error
- `2`: Warning

## Rate Limits

Free tier accounts have rate limits:
- **Search requests**: 1,000 per month
- **Detail requests**: 1,000 per month
- **Rate**: 10 requests per minute

## Best Practices

### Address Formatting
1. **Use full street names**: "Street" instead of "St", "Avenue" instead of "Ave"
2. **Include city and state**: Always provide city and state for better results
3. **Add ZIP code when available**: Improves search accuracy
4. **Check spelling**: Verify street names and city names are spelled correctly

### Error Handling
1. **Check API key**: Ensure the API key is valid and active
2. **Handle rate limits**: Implement retry logic with exponential backoff
3. **Validate responses**: Always check the `status.code` field
4. **Log errors**: Keep detailed logs for debugging

### Data Mapping
1. **Use ATTOM ID**: Always use the ATTOM ID from search results for detail requests
2. **Fallback values**: Provide fallback values when data is missing
3. **Data validation**: Validate required fields before processing
4. **Handle nulls**: Many fields may be null or undefined

## Sample Addresses for Testing

### Valid Addresses:
- `123 Main Street, Austin, TX`
- `456 Oak Avenue, New York, NY 10001`
- `789 Pine Road, Los Angeles, CA 90210`
- `321 Elm Street, Chicago, IL 60601`

### Address Components:
- **Street Address**: House number + street name
- **City**: Full city name
- **State**: Two-letter state code
- **ZIP Code**: 5-digit ZIP code (optional but recommended)

## Implementation Notes

### In This Application:
1. **Two-step process**: Search → Detail
2. **Error handling**: Comprehensive error messages for users
3. **Address parsing**: Smart parsing of various address formats
4. **Data mapping**: Converts ATTOM data to application format
5. **Fallback data**: Provides estimates when real data is unavailable

### Environment Variables:
```env
VITE_ATTOM_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.gateway.attomdata.com
```

### Testing:
- Use the built-in API test page at `/api-test`
- Check browser console for detailed request/response logs
- Verify API key configuration before testing 