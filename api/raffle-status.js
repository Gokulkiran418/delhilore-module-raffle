export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ tickets: 5 });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}