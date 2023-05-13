/* eslint-disable prefer-promise-reject-errors */
import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import formidable from 'formidable';
import { authOptions } from '../auth/[...nextauth]';

dayjs.extend(timezone);
dayjs.extend(utc);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { projectId, menuId, contentId, object } = request.query;
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
      const project = await prisma.project.findFirst({
        where: {
          OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
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
        },
      });

      return response.json({ project });
    }

    if (request.method === 'PUT') {
      if (object === 'menu') {
        const data = (await new Promise((resolve, reject) => {
          const form = formidable();

          form.parse(request, (err, fields, files) => {
            if (err) reject({ err });
            resolve({ err, fields, files });
          });
        })) as unknown as {
          err: unknown;
          fields: {
            name: string;
            position: string;
          };
        };

        if (data.err) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie udało się przetworzyć danych.',
          });
        }

        const { name, position } = data.fields;

        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
          },
        });

        if (!project) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono projektu.',
          });
        }

        const menuPosition = Number(position) || 0;

        const updatedMenu = await prisma.projectMenu.update({
          where: {
            id: Number(menuId) || 0,
          },
          data: {
            name,
            position: menuPosition,
          },
        });

        return response.json({
          success: true,
          message: 'Menu zostało zaktualizowane.',
          menu: updatedMenu,
        });
      }

      if (object === 'content') {
        const data = (await new Promise((resolve, reject) => {
          const form = formidable();

          form.parse(request, (err, fields, files) => {
            if (err) reject({ err });
            resolve({ err, fields, files });
          });
        })) as unknown as {
          err: unknown;
          fields: {
            content: string;
            position: string;
          };
        };

        if (data.err) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie udało się przetworzyć danych.',
          });
        }

        const { content, position } = data.fields;

        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
          },
        });

        if (!project) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono projektu.',
          });
        }

        const contentPosition = Number(position) || 0;

        const updatedContent = await prisma.projectMenuContent.update({
          where: {
            id: Number(contentId) || 0,
          },
          data: {
            content,
            position: contentPosition,
          },
        });

        return response.json({
          success: true,
          message: 'Treść została zaktualizowana.',
          content: updatedContent,
        });
      }

      return response.json({
        status: 'error',
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nieobsługiwany typ obiektu.',
      });
    }

    if (request.method === 'POST') {
      if (object === 'menu') {
        const data = (await new Promise((resolve, reject) => {
          const form = formidable();

          form.parse(request, (err, fields, files) => {
            if (err) reject({ err });
            resolve({ err, fields, files });
          });
        })) as unknown as {
          err: unknown;
          fields: {
            name: string;
            position: string;
          };
        };

        if (data.err) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie udało się przetworzyć danych.',
          });
        }

        const { name, position } = data.fields;

        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
          },
        });

        if (!project) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono projektu.',
          });
        }

        const menuPosition = Number(position) || 0;
        const slug = slugify(name, {
          lower: true,
          locale: 'pl',
        });

        const createdMenu = await prisma.projectMenu.create({
          data: {
            name,
            slug,
            position: menuPosition,
            project: {
              connect: {
                id: project.id,
              },
            },
          },
        });

        return response.json({
          success: true,
          message: 'Menu zostało stworzone.',
          menu: createdMenu,
        });
      }

      if (object === 'content') {
        const data = (await new Promise((resolve, reject) => {
          const form = formidable();

          form.parse(request, (err, fields, files) => {
            if (err) reject({ err });
            resolve({ err, fields, files });
          });
        })) as unknown as {
          err: unknown;
          fields: {
            content: string;
            position: string;
          };
        };

        if (data.err) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie udało się przetworzyć danych.',
          });
        }

        const { content, position } = data.fields;

        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
          },
        });

        if (!project) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono projektu.',
          });
        }

        const contentPosition = Number(position) || 0;

        const createdContent = await prisma.projectMenuContent.create({
          data: {
            content,
            position: contentPosition,
            projectMenu: {
              connect: {
                id: Number(menuId) || 0,
              },
            },
            project: {
              connect: {
                id: project.id,
              },
            },
          },
        });

        return response.json({
          success: true,
          message: 'Treść została stworzona.',
          content: createdContent,
        });
      }

      return response.json({
        status: 'error',
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nieobsługiwany typ obiektu.',
      });
    }

    if (request.method === 'DELETE') {
      if (object === 'menu') {
        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
          },
        });

        if (!project) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono projektu.',
          });
        }

        const menu = await prisma.projectMenu.findFirst({
          where: {
            id: Number(menuId) || 0,
          },
        });

        if (!menu) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono treści.',
          });
        }

        await prisma.projectMenu.delete({
          where: {
            id: menu.id,
          },
        });

        return response.json({
          success: true,
          message: 'Menu zostało usunięte.',
        });
      }

      if (object === 'content') {
        const project = await prisma.project.findFirst({
          where: {
            OR: [{ id: Number(projectId) || 0 }, { slug: projectId as string }],
          },
        });

        if (!project) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono projektu.',
          });
        }

        const content = await prisma.projectMenuContent.findFirst({
          where: {
            id: Number(contentId) || 0,
          },
        });

        if (!content) {
          return response.json({
            success: false,
            message: 'Ups! Serwer napotkał problem.',
            error_message: 'Nie znaleziono treści.',
          });
        }

        await prisma.projectMenuContent.delete({
          where: {
            id: content.id,
          },
        });

        return response.json({
          success: true,
          message: 'Treść została usunięta.',
        });
      }

      return response.json({
        status: 'error',
        message: 'Ups! Serwer napotkał problem.',
        error_message: 'Nieobsługiwany typ obiektu.',
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
