import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, productName, productId } = req.body;

  const rzp = new Razorpay({
    key_id: 'rzp_live_TfMcd6I6bvPn98',
    key_secret: process.env.RAZORPAY_SECRET
  });

  try {
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: true, // auto capture immediately
      notes: {
        product_name: productName,
        product_id: productId
      }
    });

    return res.status(200).json({ orderId: order.id, amount: order.amount });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
