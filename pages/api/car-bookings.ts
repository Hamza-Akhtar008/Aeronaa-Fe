import { NextApiRequest, NextApiResponse } from 'next';

// This is a mock handler. Replace with your DB logic.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const booking = req.body;
  // Here you would save to your DB. For now, just echo back.
  // You could also push to a bookings array in a JSON file or DB.
  // Optionally, send a confirmation email here.
  res.status(200).json({ success: true, booking });
}
