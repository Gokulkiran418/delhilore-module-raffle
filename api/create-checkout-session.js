import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // Ensure compatibility with Stripe API version
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Raffle Ticket' },
            unit_amount: 100, // $1.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://delhilore.vercel.app/?success=true',
        cancel_url: 'http://delhilore.vercel.app/?success=false',
      });
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}