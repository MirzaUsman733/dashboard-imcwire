// pages/api/verify-captcha.js

import fetch from 'node-fetch';

export async function POST(req, res) {
//   if (req.method === 'POST') {
    const token = req.body.token;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;  // Ensure this is set in your .env.local file

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // You can add additional logic here to handle the verification result as needed
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
//   } else {
//     // Handle any non-POST requests
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
}
