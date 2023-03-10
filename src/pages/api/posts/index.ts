import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const posts = await prisma.post.findMany();

  response.json({ posts });
}
