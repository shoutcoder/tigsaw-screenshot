import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Take full page screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    await browser.close();

    // Return the screenshot as base64
    const base64Screenshot = screenshot.toString('base64');
    
    return NextResponse.json({
      success: true,
      screenshot: `data:image/png;base64,${base64Screenshot}`,
      url: url,
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to capture screenshot',
        details: error.message 
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Screenshot API is running',
    usage: 'Send a POST request with {"url": "https://example.com"} to capture a screenshot',
    endpoints: {
      'POST /api/screenshot': 'Capture a full page screenshot of the provided URL'
    },
    cors: 'Enabled for cross-origin requests'
  }, {
    headers: corsHeaders
  });
}