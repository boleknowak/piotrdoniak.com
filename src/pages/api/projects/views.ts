import { prisma } from '@/lib/db';
import redis from '@/lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { slug } = request.query;
  const ipAddress = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

  const project = await prisma.project.findFirst({
    where: {
      slug: slug as string,
    },
  });

  const key = `portfolio:project:${project.id}:viewed:${ipAddress}`;

  try {
    const viewed = await redis.get(key);

    if (!viewed) {
      await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          views: project.views + 1,
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
