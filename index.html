// Vercel serverless function — creates a Stripe Checkout Session.
// Requires env vars: STRIPE_SECRET_KEY
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  try {
    const { priceId, userId, email } = req.body || {};
    if (!priceId || !userId) { res.status(400).json({ error: 'missing priceId/userId' }); return; }
    const base = process.env.PUBLIC_BASE_URL || ('https://' + req.headers.host);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      customer_email: email,
      allow_promotion_codes: true,
      success_url: base + '/app/?upgraded=1',
      cancel_url: base + '/upgrade.html',
      metadata: { supabase_user_id: userId }
    });
    res.status(200).json({ url: session.url });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
}
