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
            slug: true,
            image: true,
            is_authorized: true,
          },
        },
        featuredImage: true,
      },
    });

    const key = `portfolio:post:${post.id}:liked:${ipAddress}`;
    const liked = await redis.get(key);

    return response.status(200).json({
      post,
      liked: liked !== null,
    });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
    });
  }
}
