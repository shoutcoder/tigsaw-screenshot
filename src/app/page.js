'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const captureScreenshot = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setScreenshot(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setScreenshot(data.screenshot);
      } else {
        setError(data.error || 'Failed to capture screenshot');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📸 Screenshot API
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Capture full-page screenshots of any website
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={captureScreenshot}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Capturing...' : 'Capture Screenshot'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Taking screenshot...</p>
            </div>
          )}

          {screenshot && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Screenshot Result:
              </h3>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <img
                  src={screenshot}
                  alt="Website screenshot"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={screenshot}
                  download={`screenshot-${Date.now()}.png`}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Download PNG
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            API Documentation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Endpoint:</h3>
              <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                POST /api/screenshot
              </code>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Body:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "url": "https://example.com"
}`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "screenshot": "data:image/png;base64,...",
  "url": "https://example.com",
  "timestamp": "2024-01-01T00:00:00.000Z"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
