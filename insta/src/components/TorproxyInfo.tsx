import { useState } from 'react';

export function TorProxyInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🧅</div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900">Tor & Proxy Support Information</h3>
            <p className="text-sm text-amber-700 mt-1">
              Important notes about anonymity and browser limitations
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
        >
          {isExpanded ? 'Hide ▲' : 'Show ▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-sm text-amber-800">
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">🌐 Browser Limitations</h4>
            <p className="mb-2">
              <strong>This web application runs entirely in your browser.</strong> Due to browser security restrictions (CORS), we cannot:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-amber-700">
              <li>Directly use Tor network connections</li>
              <li>Bypass Instagram's rate limits effectively</li>
              <li>Guarantee anonymous connections</li>
              <li>Access Telegram API directly (CORS blocked)</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">🔒 Recommendations for Anonymity</h4>
            <ol className="list-decimal list-inside space-y-2 ml-4 text-amber-700">
              <li>
                <strong>Use Tor Browser:</strong> Download and use the official Tor Browser for all hunting activities
              </li>
              <li>
                <strong>VPN Service:</strong> Use a reputable VPN alongside this tool
              </li>
              <li>
                <strong>Proxy Extensions:</strong> Install browser proxy extensions (e.g., FoxyProxy) for Chrome/Firefox
              </li>
              <li>
                <strong>Backend Service:</strong> For production use, deploy a Node.js backend server that handles API calls
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">📱 Telegram Integration</h4>
            <p className="mb-2 text-amber-700">
              Telegram API calls are blocked by CORS in browsers. To enable notifications:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-amber-700">
              <li>Use a CORS proxy: <code className="bg-amber-100 px-1 rounded">https://cors-anywhere.herokuapp.com/</code></li>
              <li>Install a CORS browser extension</li>
              <li>Use a backend proxy service</li>
              <li>Deploy your own backend server</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">⚠️ Important Security Notes</h4>
            <ul className="list-disc list-inside space-y-1 ml-4 text-amber-700">
              <li>Your settings (including Telegram token) are stored locally in browser storage</li>
              <li>Clear browser data to remove stored credentials</li>
              <li>Instagram may temporarily block your IP if too many requests are made</li>
              <li>Use reasonable thread counts (5-10) to avoid detection</li>
              <li>This tool is for educational purposes only</li>
            </ul>
          </div>

          <div className="bg-amber-100 rounded-lg p-4 border border-amber-300">
            <h4 className="font-medium text-amber-900 mb-2">💡 Best Practices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-700">
              <div>
                <p className="font-medium mb-1">For Maximum Anonymity:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Use Tor Browser</li>
                  <li>Enable VPN kill switch</li>
                  <li>Use residential proxies</li>
                  <li>Rotate user agents</li>
                  <li>Randomize request timing</li>
                </ol>
              </div>
              <div>
                <p className="font-medium mb-1">For Best Results:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Use multiple fetch methods</li>
                  <li>Check extra email providers</li>
                  <li>Filter by minimum followers</li>
                  <li>Export results regularly</li>
                  <li>Monitor success rates</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}