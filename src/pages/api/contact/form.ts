import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { sendDiscordWebhook } from '@/lib/discord';

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  message: z.string().min(2).max(500),
});

export const runtime = 'experimental-edge';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'method_not_allowed' });
  }

  const { body } = request;

  if (!body) {
    return response.status(400).json({ error: 'Wypełnij wymagane pola' });
  }

  try {
    const validatedData = schema.parse(body);

    const contact = await prisma.contact.upsert({
      where: { email: validatedData.email },
      update: {
        name: validatedData.name,
      },
      create: {
        name: validatedData.name,
        email: validatedData.email,
      },
    });

    await prisma.contactMessage.create({
      data: {
        message: validatedData.message,
        contact: {
          connect: {
            id: contact.id,
          },
        },
      },
    });

    await sendDiscordWebhook({
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      content: `<@143676053297037312>`,
      embeds: [
        {
          title: 'Nowa wiadomość!',
          description: validatedData.message,
          url: 'https://piotrdoniak.com/panel/wiadomosci',
          color: 0xfefce8,
          author: {
            name: validatedData.name,
            url: `https://piotrdoniak.com/panel/wiadomosci?id=${contact.id}`,
            icon_url: `https://api.dicebear.com/6.x/bottts/png?seed=${validatedData.email}`,
          },
        },
      ],
    });

    return response.status(200).json({ message: 'Dziękuję, odezwę się wkrótce!' });
  } catch (error) {
    const issues = error.issues.map((issue) => ({ name: issue.path[0], code: issue.code }));

    return response.status(400).json({ error: 'Podane dane są niepoprawne', issues });
  }
}
