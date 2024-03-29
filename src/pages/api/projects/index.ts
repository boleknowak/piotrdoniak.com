import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { id } = request.query;

    if (!id) {
      const projects = await prisma.project.findMany({
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          logoImage: true,
        },
      });

      return response.json({ projects });
    }

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: Number(id) || 0 }, { slug: id as string }],
      },
      include: {
        projectMenu: {
          orderBy: {
            position: 'asc',
          },
          include: {
            projectMenuContent: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
        logoImage: true,
        ogLogoImage: true,
      },
    });

    return response.json({ project });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
