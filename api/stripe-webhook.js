export default async function handler(req, res) {
  if (req.method === 'POST') {
    const currentTickets = req.body.previousTickets || 1; // Default to 1 after first entry
    res.status(200).json({ success: true, tickets: currentTickets });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}