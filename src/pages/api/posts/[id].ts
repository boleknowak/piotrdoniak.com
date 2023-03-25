import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { id } = request.query;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  response.json({ post });
}
