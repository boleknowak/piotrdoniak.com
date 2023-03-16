import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  message: z.string().min(2).max(500),
});

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { body } = request;

  if (!body) {
    return response.status(400).json({ error: 'Wypełnij wymagane pola' });
  }

  try {
    const validatedData = schema.parse(body);

    const contact = await prisma.contact.upsert({
      where: { email: validatedData.email },
      update: {},
      create: {
        name: validatedData.name,
        email: validatedData.email,
      },
    });

    await prisma.contactMessages.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        contactId: contact.id,
      },
    });

    return response.status(200).json({ message: 'Dziękuję, odezwę się wkrótce!' });
  } catch (error) {
    const issues = error.issues.map((issue) => ({ name: issue.path[0], code: issue.code }));

    return response.status(400).json({ error: 'Podane dane są niepoprawne', issues });
  }
}
