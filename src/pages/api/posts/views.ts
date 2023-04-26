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

      return response.status(200).json({
        status: 'success',
      });
    }

    return response.status(200).json({
      status: 'already_viewed',
    });
  } catch (error) {
    return response.status(500).json({
      status: 'error',
    });
  }
}
