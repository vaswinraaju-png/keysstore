import { useSearchParams, Link } from 'react-router-dom';

export default function Success() {
  const [params] = useSearchParams();
  const pid = params.get('pid');
  const product = params.get('product');
  const email = params.get('email');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</h1>
        <p className="text-gray-500 text-sm mb-6">Thank you for your purchase</p>

        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
          {product && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Product</span>
              <span className="font-medium text-gray-800 text-right max-w-[200px]">{product}</span>
            </div>
          )}
          {pid && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-mono text-xs text-gray-700">{pid}</span>
            </div>
          )}
          {email && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800">{email}</span>
            </div>
          )}
        </div>

        <div className="bg-brand-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-brand-700 font-semibold mb-1">⚡ Key delivery within 15-30 minutes</p>
          <p className="text-xs text-brand-600">Your activation key will be sent from <strong>admin@vortexlabs.app</strong> to your email. Please check your inbox and spam folder.</p>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="https://wa.me/919980291663"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            💬 Contact on WhatsApp for instant support
          </a>
          <Link to="/" className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
