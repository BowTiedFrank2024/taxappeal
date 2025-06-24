# Property Tax Appeal Pro

A React application for property tax appeal analysis using the ATTOM Data API.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure ATTOM Data API

1. **Get an API Key**: 
   - Visit [ATTOM Data API Developer Portal](https://api.developer.attomdata.com/)
   - Sign up for a free account
   - Generate an API key

2. **Create Environment File**:
   - Create a `.env` file in the project root
   - Add your API key:

```env
VITE_ATTOM_API_KEY=your_attom_api_key_here
VITE_API_BASE_URL=https://api.gateway.attomdata.com
```

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Documentation

- **[Setup Guide](SETUP.md)** - Detailed step-by-step setup instructions
- **[API Reference](ATTOM_API_REFERENCE.md)** - Complete ATTOM API documentation
- **[API Test Page](http://localhost:5173/api-test)** - Built-in API testing interface

## Features

- **Property Search**: Enter any US property address to get instant analysis
- **Tax Assessment**: View current vs previous tax assessments
- **Appeal Potential**: Get personalized appeal strategy recommendations
- **API Testing**: Built-in API test page to verify configuration

## Address Format

The application accepts various address formats:

- `123 Main Street, Austin, TX`
- `456 Oak Avenue, New York, NY 10001`
- `789 Pine Road, Los Angeles, CA 90210`

## Troubleshooting

### API Key Issues
- Ensure your `.env` file is in the project root
- Verify the API key is correct and active
- Check the API test page at `/api-test` for detailed error information

### Address Not Found
- Try different address formats
- Use full street names (not abbreviations)
- Include city and state
- Check spelling of street names and cities

### Development
- Use the API test page to debug API responses
- Check browser console for detailed error logs
- Verify network connectivity to ATTOM API endpoints

## API Endpoints Used

- Property Search: `/propertyapi/v1.0.0/property/address`
- Property Details: `/propertyapi/v1.0.0/property/detail`

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
- React Router DOM 