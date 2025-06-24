# ATTOM API Setup Guide

## Step 1: Get Your API Key

1. **Visit the ATTOM Data Developer Portal**:
   - Go to: https://api.developer.attomdata.com/
   - Click "Sign Up" or "Get Started"

2. **Create an Account**:
   - Fill in your details
   - Verify your email address

3. **Generate API Key**:
   - After logging in, go to "API Keys" section
   - Click "Generate New Key"
   - Copy the API key (it will look like: `abc123def456ghi789`)

## Step 2: Configure Your Environment

1. **Create Environment File**:
   - In your project root directory, create a file named `.env`
   - Add the following content:

```env
VITE_ATTOM_API_KEY=your_actual_api_key_here
VITE_API_BASE_URL=https://api.gateway.attomdata.com
```

2. **Replace the placeholder**:
   - Replace `your_actual_api_key_here` with your real API key from Step 1

## Step 3: Test the Configuration

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Test the API**:
   - Open your browser to: http://localhost:5173
   - Navigate to the API test page: http://localhost:5173/api-test
   - Enter a test address like: `123 Main Street, Austin, TX`
   - Click "Test API" to verify the connection

## Step 4: Troubleshooting

### Common Issues:

**❌ "API Key: Missing"**
- Make sure your `.env` file is in the project root (same folder as `package.json`)
- Verify the API key is correct and not missing any characters
- Restart the development server after creating the `.env` file

**❌ "Invalid API key"**
- Double-check your API key from the ATTOM developer portal
- Make sure there are no extra spaces or characters
- Verify your account is active and not suspended

**❌ "Address not found"**
- Try different address formats:
  - `123 Main Street, Austin, TX`
  - `456 Oak Avenue, New York, NY 10001`
  - `789 Pine Road, Los Angeles, CA 90210`
- Use full street names (not abbreviations like "St" or "Ave")
- Check spelling of street names and cities

**❌ "Rate limit exceeded"**
- Wait a few minutes before trying again
- ATTOM has rate limits on free accounts
- Consider upgrading your plan if you need higher limits

## Step 5: Address Format Examples

The application accepts various address formats:

### ✅ Good Examples:
- `123 Main Street, Austin, TX`
- `456 Oak Avenue, New York, NY 10001`
- `789 Pine Road, Los Angeles, CA 90210`
- `321 Elm Street, Chicago, IL 60601`

### ❌ Avoid These:
- `123 Main St, Austin, TX` (use "Street" not "St")
- `Austin, TX` (missing street address)
- `123 Main Street` (missing city/state)

## Step 6: API Endpoints Used

The application uses these ATTOM API endpoints:

1. **Property Search**: `/propertyapi/v1.0.0/property/address`
   - Searches for properties by address
   - Returns basic property information

2. **Property Details**: `/propertyapi/v1.0.0/property/detail`
   - Gets detailed property information using ATTOM ID
   - Returns comprehensive property data

## Step 7: Development Tips

1. **Use the API Test Page**:
   - Navigate to `/api-test` in your application
   - This page shows detailed API responses
   - Helpful for debugging address parsing issues

2. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for API request/response logs
   - Check for any error messages

3. **Environment Variables**:
   - Only variables starting with `VITE_` are available in the browser
   - Changes to `.env` require restarting the development server

## Support

If you're still having issues:

1. **Check the API Test Page**: http://localhost:5173/api-test
2. **Review the README.md** file for additional information
3. **Check the ATTOM API documentation**: https://api.developer.attomdata.com/docs
4. **Verify your API key status** in the ATTOM developer portal 