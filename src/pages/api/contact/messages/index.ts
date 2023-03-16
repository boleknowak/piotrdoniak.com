import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { UserInterface } from '@/interfaces/UserInterface';

const prisma = new PrismaClient();

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ error: 'unauthorized' });
  }

  const user = session?.user as UserInterface;

  if (!user?.is_authorized) {
    return response.status(403).json({ error: 'forbidden' });
  }

  // TODO: Add pagination
  const messages = await prisma.contactMessages.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return response.status(200).json({
    messages,
  });
}
