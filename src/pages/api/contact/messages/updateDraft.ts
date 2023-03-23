import { PrismaClient, ContactStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { UserInterface } from '@/interfaces/UserInterface';

const prisma = new PrismaClient();

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'method_not_allowed' });
  }

  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ error: 'unauthorized' });
  }

  const user = session?.user as UserInterface;

  if (!user?.is_authorized) {
    return response.status(403).json({ error: 'forbidden' });
  }

  const { body } = request;

  if (!body) {
    return response.status(400).json({ error: 'Nie dostaliśmy danych!' });
  }

  try {
    await prisma.contactMessage.update({
      where: {
        id: body.id,
      },
      data: {
        draftReply: body.draftReply,
        status: body.draftReply ? ContactStatus.DRAFT : ContactStatus.VIEWED,
      },
    });

    return response.status(200).json({ message: 'Zmiany zostały zapisane.' });
  } catch (error) {
    return response.status(500).json({ error: 'Coś poszło nie tak', message: error.message });
  }
}
