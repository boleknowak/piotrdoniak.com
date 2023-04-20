import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import { authOptions } from '../auth/[...nextauth]';

dayjs.extend(timezone);
dayjs.extend(utc);

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const now = dayjs().tz('Europe/Warsaw');
    const currentTime = now.utc(true).format();
    const session = await getServerSession(request, response, authOptions);

    if (session) {
      const user = session?.user as UserInterface;

      if (user?.is_authorized) {
        const { query } = request.query;

        const posts = await prisma.post.findMany({
          where: {
            keywords: {
              contains: query as string,
            },
          },
          include: {
            category: true,
            author: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                is_authorized: true,
              },
            },
          },
          orderBy: {
            publishedAt: 'desc',
          },
        });

        return response.json({ posts });
      }
    }

    if (request.method === 'POST' && session) {
      const user = session?.user as UserInterface;

      if (user?.is_authorized) {
        const { title, content, publishedAt } = request.body;

        const post = await prisma.post.create({
          data: {
            title,
            content,
            publishedAt,
          },
        });

        return response.json({ post });
      }
    }

    const posts = await prisma.post.findMany({
      where: {
        publishedAt: {
          lte: currentTime,
        },
      },
    });

    return response.json({ posts });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
