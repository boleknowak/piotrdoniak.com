import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import { authOptions } from '../auth/[...nextauth]';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const session = await getServerSession(request, response, authOptions);

    if (!session) {
      return response.status(401).json({ error: 'unauthorized' });
    }

    const user = session?.user as UserInterface;

    if (!user?.is_authorized) {
      return response.status(403).json({ error: 'forbidden' });
    }

    if (request.method === 'DELETE') {
      const { id } = request.query;

      const category = await prisma.category.delete({
        where: {
          id: Number(id),
        },
      });

      return response.json({
        success: true,
        message: 'Kategoria została usunięta.',
        category,
      });
    }

    if (request.method === 'PUT') {
      const { id } = request.query;
      const { name } = request.body;
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

      const category = await prisma.category.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          slug,
          position: parseInt(position, 10),
        },
      });

      return response.json({
        success: true,
        message: 'Kategoria została zaktualizowana.',
        category,
      });
    }

    return response.json({
      success: false,
      message: 'Ups! Serwer napotkał problem.',
    });
  } catch (error) {
    return response.json({
      success: false,
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
