export default async function handler(req, res) {
  if (req.method === 'POST') {
    const currentTickets = req.body.previousTickets || 0; // Start from 0 if no previousTickets
    const newTickets = currentTickets + 1; // Increment by 1
    res.status(200).json({ success: true, tickets: newTickets });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}