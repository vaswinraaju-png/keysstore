import crypto from 'crypto';

const SUPABASE_URL = 'https://rxdhamxygssjfjvchjzl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGhhbXh5Z3NzamZqdmNoanpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzQzMzAsImV4cCI6MjEwNTQ1MDMzMH0.TSjS3YIk_Kx9sXdAeYEnz35i4aV6KrGm9PSgxV9_6N8';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, product } = req.body;

  // Verify signature
  const secret = process.env.RAZORPAY_SECRET;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  // Save order to Supabase
  const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      product_name: product.name,
      product_id: product.id,
      amount: product.price,
      status: 'paid',
      delivered: false,
      created_at: new Date().toISOString()
    })
  });

  const order = await orderRes.json();
  return res.status(200).json({ success: true, order });
}
