// app/debug/page.js
'use client';

import { getCookie } from 'cookies-next';

export default function DebugPage() {
  const token = getCookie('token');
  const localToken = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg space-y-2">
        <p><strong>Cookie Token:</strong> {token ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Cookie Value:</strong> {token ? token.substring(0, 30) + '...' : 'No token'}</p>
        <p><strong>LocalStorage Token:</strong> {localToken ? '✅ Yes' : '❌ No'}</p>
        <p><strong>LocalStorage User:</strong> {user ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User Data:</strong> {user || 'No user'}</p>
      </div>
      
      <div className="mt-4 flex gap-4">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}