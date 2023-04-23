import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import { authOptions } from '../auth/[...nextauth]';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const session = await getServerSession(request, response, authOptions);

    if (request.method === 'POST' && session) {
      const user = session?.user as UserInterface;

      if (user?.is_authorized) {
        const { name, description } = request.body;
        let { slug, position } = request.body;

        if (!slug) {
          slug = slugify(name, {
            lower: true,
            locale: 'pl',
          });
        }

        if (!position) {
          position = 999;
        }

        const category = await prisma.category.create({
          data: {
            name,
            slug,
            description,
            position: parseInt(position, 10),
          },
        });

        return response.json({
          success: true,
          message: 'Kategoria została dodana.',
          category,
        });
      }
    }

    if (request.query.id) {
      const category = await prisma.category.findUnique({
        where: {
          slug: request.query.id as string,
        },
      });

      return response.json({ category });
    }

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        position: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    return response.json({ categories });
  } catch (error) {
    return response.json({
      success: false,
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
