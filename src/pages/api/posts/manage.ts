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
    const session = await getServerSession(request, response, authOptions);

    if (!session) {
      return response.json({
        success: false,
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nie jesteś zalogowany.',
      });
    }

    const user = session?.user as UserInterface;

    if (!user?.is_authorized) {
      return response.json({
        success: false,
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nie jesteś upoważniony do wykonania tej akcji.',
      });
    }

    if (request.method === 'GET') {
      const { query, id } = request.query;

      if (id === undefined && query === undefined) {
        return response.json({
          success: false,
          message: 'Ups! Serwer napotkał problem.',
          error_message: 'Nie podano parametru.',
        });
      }

      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              keywords: {
                contains: query as string,
              },
            },
            {
              id: Number(id) || 0,
            },
          ],
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

    if (request.method === 'PUT') {
      const { title, categoryId, description, content, publishAt } = request.body;
      let { slug: slugUrl } = request.body;
      const { id } = request.query;

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
          id: Number(id),
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
      const { id } = request.query;
      const post = await prisma.post.delete({
        where: {
          id: Number(id),
        },
      });

      return response.json({
        success: true,
        message: 'Post został usunięty.',
        post,
      });
    }

    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
      error_message: 'Nieobsługiwana metoda HTTP.',
    });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
