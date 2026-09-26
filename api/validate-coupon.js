const SUPABASE_URL = 'https://rxdhamxygssjfjvchjzl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGhhbXh5Z3NzamZqdmNoanpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzQzMzAsImV4cCI6MjEwNTQ1MDMzMH0.TSjS3YIk_Kx9sXdAeYEnz35i4aV6KrGm9PSgxV9_6N8';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/coupons?code=eq.${encodeURIComponent(code.toUpperCase())}&active=eq.true&select=*&limit=1`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
  );

  const coupons = await r.json();
  const coupon = coupons?.[0];

  if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon' });
  if (coupon.uses_left !== null && coupon.uses_left <= 0) return res.status(400).json({ error: 'Coupon usage limit reached' });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return res.status(400).json({ error: 'Coupon has expired' });

  return res.status(200).json({ discount: coupon.discount_percent, code: coupon.code });
}
