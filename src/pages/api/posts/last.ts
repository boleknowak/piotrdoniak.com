import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const now = dayjs().tz('Europe/Warsaw');
    const currentTime = now.utc(true).format();

    const selectColumns = {
      id: true,
      authorId: true,
      title: true,
      slug: true,
      description: true,
      views: true,
      likes: true,
      readingTime: true,
      publishedAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          slug: true,
        },
      },
    };

    const post = await prisma.post.findFirst({
      where: {
        publishedAt: {
          lte: currentTime,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      select: selectColumns,
    });

    return response.json({ post });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
