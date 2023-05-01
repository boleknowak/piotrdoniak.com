import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import slugify from 'slugify';
import { makeKeywords } from '@/lib/helpers';
import formidable from 'formidable';
import { S3 } from '@aws-sdk/client-s3';
import { Image } from '@prisma/client';
import { uploadImage } from '@/lib/uploadImage';
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
          featuredImage: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });

      return response.json({ posts });
    }

    if (request.method === 'POST') {
      const { title, categoryId, description, content, readingTime, publishAt } = request.body;
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
          readingTime: Number(readingTime),
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
          title: string;
          slug: string;
          categoryId: string;
          description: string;
          content: string;
          readingTime: string;
          publishAt: string;
          lockChangeFeaturedImage: string;
        };
        files: {
          featuredImage?: {
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

      const {
        title,
        categoryId,
        description,
        content,
        readingTime,
        publishAt,
        lockChangeFeaturedImage,
      } = data.fields;
      let { slug: slugUrl } = data.fields;
      const { id } = request.query;

      let featuredImageObject = {} as Image;
      if (lockChangeFeaturedImage === 'false' && data.files?.featuredImage) {
        const uploadFeaturedImage = await uploadImage(data.files.featuredImage, s3);

        if (uploadFeaturedImage.success) {
          featuredImageObject = uploadFeaturedImage.image;
        } else {
          return response.status(500).json({
            success: false,
            message: uploadFeaturedImage.message,
            error_message: uploadFeaturedImage.error_message,
          });
        }
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

      const queryData = {
        title,
        slug: slugUrl,
        full_slug: fullSlug,
        description,
        content,
        readingTime: Number(readingTime),
        keywords,
        publishedAt: publishAt ? new Date(publishAt) : null,
        category: {
          connect: {
            id: category.id,
          },
        },
      };

      if (featuredImageObject?.id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryData.featuredImage = {
          connect: {
            id: featuredImageObject.id,
          },
        };
      }

      const post = await prisma.post.update({
        where: {
          id: Number(id),
        },
        data: queryData,
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
