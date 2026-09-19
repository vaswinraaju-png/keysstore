import { useCountdown } from '../hooks/useCountdown';

function Timer() {
  const { display, seconds } = useCountdown(900);
  const urgent = seconds < 180;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full mb-2 w-fit ${urgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Offer expires in {display}
    </div>
  );
}

export default function ProductCard({ product, buyNowUrl }) {
  const discount = Math.round((1 - product.salePrice / product.originalPrice) * 100);

  const handleBuy = () => {
    if (buyNowUrl) window.open(buyNowUrl, '_blank');
    else alert('Contact us to purchase this key!');
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      {/* Image + badge */}
      <div className="relative bg-gray-50 flex items-center justify-center h-40 p-4">
        {product.badge && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.badge}</span>
        )}
        <img
          src={product.image || 'https://placehold.co/120x120?text=Key'}
          alt={product.name}
          className="h-20 w-auto object-contain"
          loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/120x120?text=Key'; }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-brand-500 font-medium uppercase tracking-wide mb-1">{product.category}</span>
        <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">{product.name}</h2>

        {product.showTimer && <Timer />}

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-extrabold text-brand-700">₹{product.salePrice.toLocaleString('en-IN')}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">-{discount}%</span>
          </div>

          <button
            onClick={handleBuy}
            className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-900 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors touch-manipulation"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
