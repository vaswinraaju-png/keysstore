import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const handle = (e) => {
    e.preventDefault();
    const correct = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (pw === correct) {
      sessionStorage.setItem('ks_admin', '1');
      onLogin();
    } else {
      setErr('Incorrect password');
      setPw('');
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">KeyStore CMS</p>
        </div>
        <form onSubmit={handle} className="flex flex-col gap-4">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(''); }}
            placeholder="Enter admin password"
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoFocus
          />
          {err && <p className="text-red-500 text-xs">{err}</p>}
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors">
            Sign In
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">Set password via VITE_ADMIN_PASSWORD env variable on Vercel</p>
      </div>
    </div>
  );
}
