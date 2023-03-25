import { ContactMessageStatus, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { UserInterface } from '@/interfaces/UserInterface';

const prisma = new PrismaClient();

interface ContactSchema {
  id: number;
  name: string;
  email: string;
  avatar: string;
  draftReply: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageCreatedAt: Date;
  messages: {
    id: number;
    contactId: number;
    message: string;
    status: ContactMessageStatus;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ error: 'unauthorized' });
  }

  const user = session?.user as UserInterface;

  if (!user?.is_authorized) {
    return response.status(403).json({ error: 'forbidden' });
  }

  let showClosed = false;
  if (request.query.showClosed === 'true') {
    showClosed = true;
  }

  // TODO: Add pagination, limit and filters

  const contacts = await prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      ContactMessage: {
        where: {
          status: {
            not: showClosed ? undefined : ContactMessageStatus.CLOSED,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const filteredContacts = contacts.filter((contact) => contact.ContactMessage.length > 0);

  const messages: ContactSchema[] = filteredContacts.map((contact) => {
    const lastMessageCreatedAt =
      contact.ContactMessage.length > 0
        ? contact.ContactMessage[contact.ContactMessage.length - 1].createdAt
        : null;

    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      avatar: contact.avatar,
      draftReply: contact.draftReply,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      lastMessageCreatedAt,
      messages: contact.ContactMessage,
    };
  });

  return response.status(200).json({
    data: messages,
  });
}
