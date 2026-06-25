// Vercel serverless function — Stripe webhook -> updates Supabase profiles.
// Requires env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export const config = { api: { bodyParser: false } };

function buffer(req){return new Promise((resolve,reject)=>{const c=[];req.on('data',x=>c.push(x));req.on('end',()=>resolve(Buffer.concat(c)));req.on('error',reject);});}

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) { console.error('sig verify failed', e.message); res.status(400).send('Webhook Error: ' + e.message); return; }
  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      const uid = s.client_reference_id || (s.metadata && s.metadata.supabase_user_id);
      if (uid) await supa.from('profiles').update({ is_pro:true, stripe_customer_id:s.customer, stripe_subscription_id:s.subscription, pro_until:null }).eq('id', uid);
    }
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const active = ['active','trialing','past_due'].includes(sub.status);
      const end = sub.current_period_end ? new Date(sub.current_period_end*1000).toISOString() : null;
      await supa.from('profiles').update({ is_pro: active, pro_until: active ? end : new Date().toISOString() }).eq('stripe_subscription_id', sub.id);
    }
    res.status(200).json({ received: true });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
}
