import { useState } from 'react';

const RZP_KEY = 'rzp_live_TfMcd6I6bvPn98';

export default function CheckoutModal({ product, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email';
    if (!form.phone.match(/^[6-9]\d{9}$/)) return 'Please enter a valid 10-digit mobile number';
    return null;
  };

  const handlePay = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    // Load Razorpay script
    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    // Create Razorpay order first
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: product.salePrice, productName: product.name, productId: product.id })
    });
    const orderData = await orderRes.json();
    if (!orderData.orderId) { setError('Could not initiate payment. Please try again.'); setLoading(false); return; }

    const options = {
      key: RZP_KEY,
      amount: orderData.amount,
      currency: 'INR',
      order_id: orderData.orderId,
      name: 'CDKeys India',
      description: product.name,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone
      },
      theme: { color: '#2f4acb' },
      handler: async (response) => {
        try {
          const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || '',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || '',
              customer: form,
              product: { id: product.id, name: product.name, price: product.salePrice }
            })
          });

          // GA purchase event
          if (window.gtag) {
            window.gtag('event', 'purchase', {
              transaction_id: response.razorpay_payment_id,
              value: product.salePrice,
              currency: 'INR',
              items: [{ item_id: product.id, item_name: product.name, price: product.salePrice, quantity: 1 }]
            });
          }

          window.location.href = `/success?pid=${response.razorpay_payment_id}&product=${encodeURIComponent(product.name)}&email=${encodeURIComponent(form.email)}`;
        } catch (e) {
          setError('Payment received but verification failed. Please contact support.');
        }
        setLoading(false);
      },
      modal: { ondismiss: () => setLoading(false) }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setError('Payment failed. Please try again.');
      setLoading(false);
    });
    rzp.open();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-gray-800 text-sm">Complete Purchase</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Price */}
        <div className="px-5 pt-4 pb-2 bg-brand-50">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-700">₹{product.salePrice.toLocaleString('en-IN')}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-green-600 font-medium mt-0.5">⚡ Instant digital delivery after payment</p>
        </div>

        {/* Form */}
        <div className="p-5 flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Aswin Raaju"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile Number *</label>
            <div className="flex gap-2">
              <span className="border rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="flex-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors touch-manipulation mt-1"
          >
            {loading ? 'Processing...' : `Pay ₹${product.salePrice.toLocaleString('en-IN')} Securely`}
          </button>

          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <span>🔒 Secured by Razorpay</span>
            <span>·</span>
            <span>UPI, Cards, NetBanking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
