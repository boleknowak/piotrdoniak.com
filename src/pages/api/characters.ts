import delay from '@/lib/delay';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const res = await fetch('https://rickandmortyapi.com/api/character');
  await delay(2000);
  const data = await res.json();

  response.json({ data });
}
