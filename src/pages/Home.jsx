import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import SEOHead from '../components/SEOHead';

const CATEGORIES = ['All', 'Windows', 'Office', 'Software', 'AI Tools'];

export default function Home() {
  const { products, siteSettings } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const cat = searchParams.get('cat') || 'All';

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (!p.active) return false;
      if (cat !== 'All' && p.category !== cat) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, cat, search]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": siteSettings.siteName,
    "description": siteSettings.metaDesc,
    "itemListElement": filtered.map((p, i) => ({
      "@type": "ListItem", "position": i + 1,
      "item": { "@type": "Product", "name": p.name, "offers": { "@type": "Offer", "price": p.salePrice, "priceCurrency": "INR", "availability": "https://schema.org/InStock" } }
    }))
  };

  return (
    <>
      <SEOHead
        title={siteSettings.metaTitle}
        description={siteSettings.metaDesc}
        ogTitle={siteSettings.metaTitle}
        ogDesc={siteSettings.metaDesc}
        ogImage={siteSettings.ogImage}
        schema={schema}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-2 leading-tight">
            Genuine Software Keys<br className="md:hidden" /> at India's Best Prices
          </h1>
          <p className="text-brand-100 text-sm md:text-base mb-6">{siteSettings.tagline}</p>
          <div className="flex items-center max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
            <svg className="w-5 h-5 text-gray-400 ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Windows, Office, Canva..."
              className="flex-1 px-3 py-3 text-gray-800 text-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-accent-400 py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-brand-900">
          <span>✅ 100% Genuine Keys</span>
          <span>⚡ Instant Digital Delivery</span>
          <span>🔒 Secure Purchase</span>
          <span>📞 24/7 Support</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { setSearchParams(c === 'All' ? {} : { cat: c }); }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${cat === c ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-gray-500 mt-3 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No products found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
            {filtered.map(p => <ProductCard key={p.id} product={p} buyNowUrl={siteSettings.buyNowUrl} />)}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-100 text-center text-xs py-6 px-4 mt-4">
        <p className="font-semibold text-white text-sm mb-1">{siteSettings.siteName}</p>
        <p>Genuine software keys at India's best prices. All products are digital delivery.</p>
        <p className="mt-2 text-brand-300">© {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.</p>
      </footer>
    </>
  );
}
