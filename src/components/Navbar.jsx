import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { siteSettings } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-brand-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-400 rounded-md flex items-center justify-center">
            <span className="text-brand-900 font-extrabold text-sm">K</span>
          </div>
          <span className="font-bold text-lg tracking-tight">{siteSettings.siteName}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-accent-400 transition-colors">Windows</Link>
          <Link to="/?cat=Office" className="hover:text-accent-400 transition-colors">Office</Link>
          <Link to="/?cat=Software" className="hover:text-accent-400 transition-colors">Software</Link>
          <Link to="/?cat=AI+Tools" className="hover:text-accent-400 transition-colors">AI Tools</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-md hover:bg-brand-700" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-brand-700 px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-accent-400">All Products</Link>
          <Link to="/?cat=Windows" onClick={() => setOpen(false)} className="hover:text-accent-400">Windows</Link>
          <Link to="/?cat=Office" onClick={() => setOpen(false)} className="hover:text-accent-400">Office</Link>
          <Link to="/?cat=Software" onClick={() => setOpen(false)} className="hover:text-accent-400">Software</Link>
          <Link to="/?cat=AI+Tools" onClick={() => setOpen(false)} className="hover:text-accent-400">AI Tools</Link>
        </div>
      )}
    </nav>
  );
}
