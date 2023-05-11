import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import formidable from 'formidable';
import { S3 } from '@aws-sdk/client-s3';
import { Image } from '@prisma/client';
import { uploadImage } from '@/lib/S3Manager';
import { authOptions } from '../auth/[...nextauth]';

dayjs.extend(timezone);
dayjs.extend(utc);

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { id } = request.query;
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
      if (!id) {
        const projects = await prisma.project.findMany({
          orderBy: {
            publishedAt: 'desc',
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
    }

    if (request.method === 'PUT') {
      const data = (await new Promise((resolve, reject) => {
        const form = formidable();

        form.parse(request, (err, fields, files) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (err) reject({ err });
          resolve({ err, fields, files });
        });
      })) as unknown as {
        err: unknown;
        fields: {
          name: string;
          slug: string;
          description: string;
          url: string;
          publishedAt: string;
          lockChangeLogo: string;
          lockChangeOgImage: string;
        };
        files: {
          logoImage?: {
            originalFilename: string;
            filepath: string;
            size: number;
            mimetype: string;
          };
          ogImage?: {
            originalFilename: string;
            filepath: string;
            size: number;
            mimetype: string;
          };
        };
      };

      if (data.err) {
        return response.json({
          success: false,
          message: 'Ups! Serwer napotkał problem.',
          error_message: 'Nie udało się przetworzyć danych.',
        });
      }

      const { name, description, publishedAt, lockChangeLogo, lockChangeOgImage } = data.fields;
      let { slug: slugUrl } = data.fields;

      slugUrl = slugify(slugUrl, {
        lower: true,
        locale: 'pl',
      });

      let logoImageObject = {} as Image;
      if (lockChangeLogo === 'false' && data.files?.logoImage) {
        const uploadLogoImage = await uploadImage({
          file: data.files.logoImage,
          s3,
          alt: `${data.fields.slug}-logo`,
          folder: `projects/${slugUrl}`,
        });

        if (uploadLogoImage.success) {
          logoImageObject = uploadLogoImage.image;
        } else {
          return response.status(500).json({
            success: false,
            message: uploadLogoImage.message,
            error_message: uploadLogoImage.error_message,
          });
        }
      }

      let ogImageObject = {} as Image;
      if (lockChangeOgImage === 'false' && data.files?.ogImage) {
        const uploadOgImage = await uploadImage({
          file: data.files.ogImage,
          s3,
          alt: `${data.fields.slug}-logo-og`,
          folder: `projects/${slugUrl}`,
        });

        if (uploadOgImage.success) {
          ogImageObject = uploadOgImage.image;
        } else {
          return response.status(500).json({
            success: false,
            message: uploadOgImage.message,
            error_message: uploadOgImage.error_message,
          });
        }
      }

      const queryData = {
        name,
        slug: slugUrl,
        description,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      };

      if (logoImageObject?.id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryData.logoImage = {
          connect: {
            id: logoImageObject.id,
          },
        };
      }

      if (ogImageObject?.id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryData.ogLogoImage = {
          connect: {
            id: ogImageObject.id,
          },
        };
      }

      const project = await prisma.project.update({
        where: {
          id: Number(id),
        },
        data: queryData,
      });

      if (project.logoImageId) {
        await prisma.image.update({
          where: {
            id: project.logoImageId,
          },
          data: {
            title: `Logo projektu ${data.fields.name}`,
          },
        });
      }

      if (project.ogLogoImageId) {
        await prisma.image.update({
          where: {
            id: project.ogLogoImageId,
          },
          data: {
            title: `Logo projektu ${data.fields.name} (OG)`,
          },
        });
      }

      return response.status(200).json({
        success: true,
        message: 'Projekt został zaktualizowany.',
        project,
      });
    }

    return response.json({
      status: 'error',
    });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
      error_message: error.message,
    });
  }
}
