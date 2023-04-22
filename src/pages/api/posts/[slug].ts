import { prisma } from '@/lib/db';
import redis from '@/lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { slug } = request.query;
  const ipAddress = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

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
            image: true,
            is_authorized: true,
          },
        },
      },
    });

    const key = `portfolio:post:${post.id}:viewed:${ipAddress}`;
    const viewed = await redis.get(key);

    if (!viewed) {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          views: post.views + 1,
        },
      });

      await redis.set(key, 'true', 'EX', 60 * 60 * 24);
    }

    return response.json({ post });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
    });
  }
}
