import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { slug } = request.query;

  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ slug: slug as string }, { full_slug: slug as string }],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            // email: true,
            image: true,
            is_authorized: true,
          },
        },
      },
    });

    return response.json({ post });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
    });
  }
}
