const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Raffle Ticket' },
            unit_amount: 100,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/?success=true',
            cancel_url: 'http://localhost:3000/?success=false',
      });
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}