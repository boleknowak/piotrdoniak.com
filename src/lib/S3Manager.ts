import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Image } from '@prisma/client';
import { createReadStream } from 'fs';
import slugify from 'slugify';
import { prisma } from './db';

type FileProp = {
  filepath: string;
  originalFilename: string;
  size: number;
  mimetype: string;
};

type UploadImageProps = {
  file: FileProp;
  s3: S3;
  alt: string;
  folder?: string;
};

type DeleteImageProps = {
  image: Image;
  s3: S3;
};

export const uploadImage = async ({ file, s3, alt = '', folder = 'images' }: UploadImageProps) => {
  const { filepath: tempFilePath } = file;
  const name = `${slugify(alt, {
    lower: true,
    locale: 'pl',
  })}.png`;
  const readStream = createReadStream(tempFilePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${name}`,
    Body: readStream,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    const res = await s3.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    if (res.$metadata.httpStatusCode !== 200) {
      throw new Error('Error uploading file');
    }

    const imageObject = await prisma.image.create({
      data: {
        name,
        title: alt,
        url,
        size: file.size,
        type: file.mimetype,
      },
    });

    return {
      success: true,
      image: imageObject,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Ups! Serwer napotkał problem.',
      error_message: err.message || 'Nie udało się przetworzyć danych.',
    };
  }
};

export const deleteImage = async ({ image, s3 }: DeleteImageProps) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `images/${image.name}`,
  });

  try {
    const res = await s3.send(command);

    if (res.$metadata.httpStatusCode !== 204) {
      throw new Error('Error deleting file');
    }

    await prisma.image.delete({
      where: {
        id: image.id,
      },
    });
  } catch (err) {
    return {
      success: false,
      message: 'Ups! Serwer napotkał problem.',
      error_message: 'Nie udało się przetworzyć danych.',
    };
  }

  return {
    success: true,
    message: 'Pomyślnie usunięto obrazek.',
    image,
  };
};
