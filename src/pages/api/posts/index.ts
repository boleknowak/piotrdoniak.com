import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import { makeKeywords } from '@/lib/helpers';
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
        if (request.method === 'GET') {
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

          // console.log(process.memoryUsage().heapUsed / 1024 / 1024);

          return response.json({ posts });
        }

        if (request.method === 'POST') {
          const { title, categoryId, description, content, publishAt } = request.body;
          let { slug } = request.body;

          const category = await prisma.category.findUnique({
            where: {
              id: Number(categoryId),
            },
          });

          if (!category) {
            return response.json({
              success: false,
              message: 'Ups! Serwer napotkał problem.',
              error_message: 'Nie znaleziono kategorii o podanym ID.',
            });
          }

          const fullSlug = slugify(title, {
            lower: true,
            locale: 'pl',
          });

          slug = slugify(slug, {
            lower: true,
            locale: 'pl',
          });

          const keywords = makeKeywords([
            title,
            slug,
            description,
            user.name.toLocaleLowerCase(),
            category.name.toLocaleLowerCase(),
          ]);

          const post = await prisma.post.create({
            data: {
              title,
              slug,
              full_slug: fullSlug,
              description,
              content,
              keywords,
              publishedAt: publishAt ? new Date(publishAt) : null,
              category: {
                connect: {
                  id: category.id,
                },
              },
              author: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

          return response.json({
            success: true,
            message: 'Post został dodany.',
            post,
          });
        }

        return response.json({
          status: 'error',
          message: 'Ups! Serwer napotkał problem.',
          error_message: 'Nieobsługiwana metoda HTTP.',
        });
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
