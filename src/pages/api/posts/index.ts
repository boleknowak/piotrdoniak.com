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
    const { category: categoryId, all } = request.query;

    const selectColmuns = {
      id: true,
      authorId: true,
      // categoryId: true,
      title: true,
      slug: true,
      description: true,
      // keywords: true,
      views: true,
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

    if (all) {
      const posts = await prisma.post.findMany({
        where: {
          publishedAt: {
            lte: currentTime,
          },
        },
        select: selectColmuns,
      });

      return response.json({ posts });
    }

    if (!categoryId) {
      return response.json({
        success: false,
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nie znaleziono kategorii.',
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      return response.json({
        success: false,
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nie znaleziono kategorii.',
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        categoryId: category.id,
        publishedAt: {
          lte: currentTime,
        },
      },
      select: selectColmuns,
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
