import crypto from 'crypto';
import { Resend } from 'resend';

const SUPABASE_URL = 'https://rxdhamxygssjfjvchjzl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGhhbXh5Z3NzamZqdmNoanpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzQzMzAsImV4cCI6MjEwNTQ1MDMzMH0.TSjS3YIk_Kx9sXdAeYEnz35i4aV6KrGm9PSgxV9_6N8';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, product } = req.body;

  // Verify signature
  const secret = process.env.RAZORPAY_SECRET;
  const body = (razorpay_order_id || '') + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (razorpay_signature && expectedSignature !== razorpay_signature) {
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
      order_id: razorpay_order_id || razorpay_payment_id,
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

  // Send notification email to admin
  try {
    await resend.emails.send({
      from: 'CDKeys India <onboarding@resend.dev>',
      to: 'v.aswinraaju@gmail.com',
      subject: `🔑 New Order: ${product.name} — ₹${product.price.toLocaleString('en-IN')}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h2 style="color:#2f4acb">New Order Received!</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Product</td><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">${product.name}</td></tr>
            <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Amount</td><td style="padding:8px;font-weight:bold;color:#16a34a;border-bottom:1px solid #eee">₹${product.price.toLocaleString('en-IN')}</td></tr>
            <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Customer</td><td style="padding:8px;border-bottom:1px solid #eee">${customer.name}</td></tr>
            <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">${customer.email}</td></tr>
            <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">+91 ${customer.phone}</td></tr>
            <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Payment ID</td><td style="padding:8px;font-family:monospace;font-size:12px;border-bottom:1px solid #eee">${razorpay_payment_id}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#fef3c7;border-radius:8px">
            <p style="margin:0;font-weight:bold;color:#92400e">⚡ Action Required: Send activation key to ${customer.email} within 15-30 minutes</p>
          </div>
          <p style="margin-top:16px;color:#666;font-size:12px">CDKeys India — cdkeys.site</p>
        </div>
      `
    });
  } catch (e) {
    console.error('Email send failed:', e.message);
  }

  return res.status(200).json({ success: true, order });
}
