// import delay from '@/lib/delay';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const res = await fetch('https://rickandmortyapi.com/api/character');
  // await delay(2000);
  const data = await res.json();

  response.json({ data });
}
