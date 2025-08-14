# Screenshot API

A powerful Next.js API that captures full-page screenshots of any website using Puppeteer.

## Features

- 📸 Full-page screenshot capture
- 🌐 Support for any public URL
- 🎨 Beautiful web interface for testing
- 📱 Responsive design with dark mode support
- 🔒 Input validation and error handling
- 📥 Download screenshots as PNG files
- ⚡ Fast and reliable using Puppeteer

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Usage

### Endpoint

```
POST /api/screenshot
```

### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "url": "https://example.com"
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "screenshot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "https://example.com",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error (400/500):**
```json
{
  "error": "Invalid URL format",
  "details": "Additional error information"
}
```

## Examples

### Using cURL

```bash
curl -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('/api/screenshot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://example.com' }),
});

const data = await response.json();

if (data.success) {
  // Use the base64 screenshot
  const img = document.createElement('img');
  img.src = data.screenshot;
  document.body.appendChild(img);
}
```

### Using Python

```python
import requests
import base64

response = requests.post('http://localhost:3000/api/screenshot', 
                        json={'url': 'https://example.com'})

if response.status_code == 200:
    data = response.json()
    if data['success']:
        # Decode base64 and save as file
        screenshot_data = data['screenshot'].split(',')[1]
        with open('screenshot.png', 'wb') as f:
            f.write(base64.b64decode(screenshot_data))
```

## Configuration

The API uses the following Puppeteer configuration:

- **Viewport:** 1920x1080
- **Device Scale Factor:** 1
- **Wait Until:** networkidle2 (waits for network to be idle)
- **Timeout:** 30 seconds
- **Screenshot Type:** PNG
- **Full Page:** true

## Error Handling

The API handles various error scenarios:

- **Missing URL:** Returns 400 with "URL is required"
- **Invalid URL:** Returns 400 with "Invalid URL format"
- **Network Errors:** Returns 500 with error details
- **Timeout:** Returns 500 if page load exceeds 30 seconds

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Performance Considerations

- Screenshots are returned as base64 encoded strings
- Large pages may take longer to capture
- Consider implementing rate limiting for production use
- Memory usage scales with page complexity

## CORS Configuration

The API is configured to accept requests from any domain with the following CORS headers:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### Cross-Origin Usage Example

```javascript
// From any external domain
fetch('https://your-domain.com/api/screenshot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url: 'https://example.com' }),
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Screenshot captured:', data.screenshot);
  }
});
```

## Security Notes

- Only public URLs are supported
- Input validation prevents malicious URLs
- CORS is enabled for all origins (consider restricting in production)
- No authentication required (add if needed for production)
- Consider implementing rate limiting for production use
