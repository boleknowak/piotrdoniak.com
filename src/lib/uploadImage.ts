import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Image } from '@prisma/client';
import { createReadStream } from 'fs';
import { prisma } from './db';

type FileProp = {
  filepath: string;
  originalFilename: string;
  size: number;
  mimetype: string;
};

export const uploadImage = async (file: FileProp, s3: S3) => {
  const { filepath: tempFilePath, originalFilename } = file;
  const fileName = `${Date.now()}-${originalFilename}`;
  const readStream = createReadStream(tempFilePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `images/${fileName}`,
    Body: readStream,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  let fileUploaded = false;
  let featuredImageObject = {} as Image;

  try {
    const res = await s3.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    if (res.$metadata.httpStatusCode !== 200) {
      throw new Error('Error uploading file');
    }

    featuredImageObject = await prisma.image.create({
      data: {
        name: fileName,
        url,
        size: file.size,
        type: file.mimetype,
      },
    });

    fileUploaded = true;
  } catch (err) {
    fileUploaded = false;
  }

  if (!fileUploaded) {
    return {
      success: false,
      message: 'Ups! Serwer napotkał problem.',
      error_message: 'Nie udało się przetworzyć danych.',
    };
  }

  return {
    success: true,
    message: 'Pomyślnie dodano obrazek.',
    image: featuredImageObject,
  };
};
