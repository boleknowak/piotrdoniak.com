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
import { uploadImage, deleteImage } from '@/lib/S3Manager';
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
          ogImage: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });

      return response.json({ posts });
    }

    if (request.method === 'POST') {
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
        };
      };

      if (data.err) {
        return response.json({
          success: false,
          message: 'Ups! Serwer napotkał problem.',
          error_message: 'Nie udało się przetworzyć danych.',
        });
      }

      const { title, categoryId, description, content, readingTime, publishAt } = data.fields;
      let { slug } = data.fields;

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
          featuredImageTitle: string;
          ogImageTitle: string;
          stateChangeFeaturedImage: string;
          stateChangeOgImage: string;
        };
        files: {
          featuredImage?: {
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

      const {
        title,
        categoryId,
        description,
        content,
        readingTime,
        publishAt,
        stateChangeFeaturedImage,
        stateChangeOgImage,
      } = data.fields;
      let { slug: slugUrl } = data.fields;
      const { id } = request.query;

      let featuredImageObject = {} as Image;
      if (stateChangeFeaturedImage === 'true' && data.files?.featuredImage) {
        const uploadFeaturedImage = await uploadImage({
          file: data.files.featuredImage,
          s3,
          alt: data.fields.featuredImageTitle,
          folder: 'images',
        });

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

      let ogImageObject = {} as Image;
      if (stateChangeOgImage === 'true' && data.files?.ogImage) {
        const uploadOgImage = await uploadImage({
          file: data.files.ogImage,
          s3,
          alt: data.fields.ogImageTitle,
          folder: 'images',
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

      if (ogImageObject?.id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryData.ogImage = {
          connect: {
            id: ogImageObject.id,
          },
        };
      }

      const post = await prisma.post.update({
        where: {
          id: Number(id),
        },
        data: queryData,
      });

      if (post.featuredImageId) {
        await prisma.image.update({
          where: {
            id: post.featuredImageId,
          },
          data: {
            title: data.fields.featuredImageTitle,
          },
        });
      }

      if (post.ogImageId) {
        await prisma.image.update({
          where: {
            id: post.ogImageId,
          },
          data: {
            title: data.fields.ogImageTitle,
          },
        });
      }

      return response.json({
        success: true,
        message: 'Post został zaktualizowany.',
        post,
      });
    }

    if (request.method === 'DELETE') {
      const { id } = request.query;
      const removeImage = request.query.removeImage as string;
      const validValues = ['featuredImage', 'ogImage'];

      if (removeImage) {
        if (validValues.includes(removeImage)) {
          const post = await prisma.post.findUnique({
            where: {
              id: Number(id),
            },
            include: {
              featuredImage: true,
              ogImage: true,
            },
          });

          if (!post) {
            return response.json({
              success: false,
              message: 'Ups! Serwer napotkał problem.',
              error_message: 'Nie znaleziono posta o podanym ID.',
            });
          }

          if (post.featuredImage && removeImage === 'featuredImage') {
            await deleteImage({
              s3,
              image: post.featuredImage,
            });

            await prisma.post.update({
              where: {
                id: Number(id),
              },
              data: {
                featuredImage: {
                  disconnect: true,
                },
              },
            });
          }

          if (post.ogImage && removeImage === 'ogImage') {
            await deleteImage({
              s3,
              image: post.ogImage,
            });

            await prisma.post.update({
              where: {
                id: Number(id),
              },
              data: {
                ogImage: {
                  disconnect: true,
                },
              },
            });
          }

          return response.json({
            success: true,
            message: 'Obraz został usunięty.',
            post,
          });
        }
        return response.json({
          success: false,
          message: 'Wybierz poprawny typ!',
        });
      }

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
