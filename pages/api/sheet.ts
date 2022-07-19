// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name?: string;
  email?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({
      auth,
      version: 'v4',
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'A1:D1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, email, message]],
      },
    });

    return res.status(201).json({ message: 'It works!', response });
  }
  return res.status(200).json({
    message: 'Hello',
  });
}
