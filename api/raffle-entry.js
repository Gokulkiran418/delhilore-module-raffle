export default async function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ success: true, tickets: 6 });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}