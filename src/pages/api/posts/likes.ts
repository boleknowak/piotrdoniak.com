import { prisma } from '@/lib/db';
import redis from '@/lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { slug } = request.query;
  const ipAddress = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

  if (request.method === 'GET') {
    try {
      const post = await prisma.post.findFirst({
        where: {
          OR: [{ slug: slug as string }, { full_slug: slug as string }],
        },
      });

      const key = `portfolio:post:${post.id}:liked:${ipAddress}`;
      const liked = await redis.get(key);

      return response.status(200).json({
        liked: liked !== null,
      });
    } catch (error) {
      return response.json({
        status: 'error',
        message: 'Ups! Serwer napotkał problem.',
      });
    }
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ slug: slug as string }, { full_slug: slug as string }],
      },
    });

    const key = `portfolio:post:${post.id}:liked:${ipAddress}`;
    const liked = await redis.get(key);

    if (liked) {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          likes: post.likes - 1,
        },
      });

      await redis.del(key);

      return response.status(200).json({
        status: 'unliked',
        liked: false,
        likes: post.likes - 1,
      });
    }

    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        likes: post.likes + 1,
      },
    });

    await redis.set(key, new Date().toISOString());

    return response.status(200).json({
      status: 'liked',
      liked: true,
      likes: post.likes + 1,
    });
  } catch (error) {
    return response.status(500).json({
      status: 'error',
    });
  }
}
