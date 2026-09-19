import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';
import ProductCard from '../components/ProductCard';
import { useCountdown } from '../hooks/useCountdown';

function Timer() {
  const { display, seconds } = useCountdown(900);
  const urgent = seconds < 180;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${urgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Offer expires in {display}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { products, siteSettings } = useStore();
  const navigate = useNavigate();

  const product = products.find(p => p.seo?.slug === slug && p.active);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Product not found</h1>
        <p className="text-gray-500 text-sm mb-6">This product may have been removed or the link is incorrect.</p>
        <Link to="/" className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700">Back to Store</Link>
      </div>
    );
  }

  const discount = Math.round((1 - product.salePrice / product.originalPrice) * 100);
  const related = products.filter(p => p.active && p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleBuy = () => {
    if (siteSettings.whatsappNumber) {
      const msg = encodeURIComponent(`Hi, I want to buy: ${product.name} at ₹${product.salePrice.toLocaleString('en-IN')}`);
      window.open(`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, '')}?text=${msg}`, '_blank');
    } else if (siteSettings.buyNowUrl) {
      window.open(siteSettings.buyNowUrl, '_blank');
    } else {
      alert('Contact us to purchase this key!');
    }
  };

  const schema = product.seo?.schema ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description || product.seo?.metaDesc,
    "offers": {
      "@type": "Offer",
      "price": product.salePrice,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
    }
  } : null;

  return (
    <>
      <SEOHead
        title={product.seo?.metaTitle}
        description={product.seo?.metaDesc}
        keywords={product.seo?.keywords}
        ogTitle={product.seo?.ogTitle || product.seo?.metaTitle}
        ogDesc={product.seo?.ogDesc || product.seo?.metaDesc}
        ogImage={product.seo?.ogImage || product.image}
        canonical={product.seo?.canonical || `${window.location.origin}/product/${slug}`}
        robots={product.seo?.robots}
        schema={schema}
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link to={`/?cat=${product.category}`} className="hover:text-brand-600">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Main product */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image panel */}
            <div className="md:w-72 bg-gray-50 flex items-center justify-center p-10 shrink-0">
              {product.badge && (
                <span className="hidden md:block absolute mt-[-180px] ml-[-140px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.badge}</span>
              )}
              <img
                src={product.image || 'https://placehold.co/200x200?text=Key'}
                alt={product.name}
                className="w-36 h-36 object-contain"
                onError={e => { e.target.src = 'https://placehold.co/200x200?text=Key'; }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 p-6 flex flex-col gap-4">
              <div>
                <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{product.category}</span>
                {product.badge && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.badge}</span>}
                <h1 className="text-lg md:text-xl font-bold text-gray-900 mt-1 leading-snug">{product.name}</h1>
              </div>

              {product.showTimer && <Timer />}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-brand-700">₹{product.salePrice.toLocaleString('en-IN')}</span>
                <span className="text-base text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-lg">Save {discount}%</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              )}

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">✅ Genuine Key</span>
                <span className="flex items-center gap-1">⚡ Instant Delivery</span>
                <span className="flex items-center gap-1">🔒 Secure Purchase</span>
                <span className="flex items-center gap-1">📞 24/7 Support</span>
              </div>

              {/* Buy button */}
              <button
                onClick={handleBuy}
                className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 active:bg-brand-900 text-white font-bold text-base py-3.5 px-10 rounded-xl transition-colors touch-manipulation"
              >
                Buy Now — ₹{product.salePrice.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-base font-bold text-gray-800 mb-4">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} buyNowUrl={siteSettings.buyNowUrl} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
