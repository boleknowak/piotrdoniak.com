import { prisma } from '@/lib/db';
import redis from '@/lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import { makeKeywords } from '@/lib/helpers';
import { authOptions } from '../auth/[...nextauth]';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { slug } = request.query;
  const ipAddress = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  const session = await getServerSession(request, response, authOptions);

  if (session) {
    const user = session?.user as UserInterface;

    if (user?.is_authorized) {
      if (request.method === 'GET') {
        const post = await prisma.post.findFirst({
          where: {
            OR: [
              { slug: slug as string },
              { full_slug: slug as string },
              { id: Number(slug || 0) || 0 },
            ],
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
          },
        });

        return response.json({ post });
      }

      if (request.method === 'PUT') {
        const { title, categoryId, description, content, publishAt } = request.body;
        let { slug: slugUrl } = request.body;

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

        slugUrl = slugify(slugUrl, {
          lower: true,
          locale: 'pl',
        });

        const keywords = makeKeywords([
          title,
          slugUrl,
          description,
          user.name.toLocaleLowerCase(),
          category.name.toLocaleLowerCase(),
        ]);

        const post = await prisma.post.update({
          where: {
            id: Number(slug),
          },
          data: {
            title,
            slug: slugUrl,
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
          },
        });

        return response.json({
          success: true,
          message: 'Post został zaktualizowany.',
          post,
        });
      }

      if (request.method === 'DELETE') {
        const post = await prisma.post.delete({
          where: {
            id: Number(slug),
          },
        });

        return response.json({
          success: true,
          message: 'Post został usunięty.',
          post,
        });
      }
    }
  }

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
