import redis from '@/lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { socials } from '@/lib/socials';
import { getServerSession } from 'next-auth';
import { UserInterface } from '@/interfaces/UserInterface';
import { authOptions } from '../auth/[...nextauth]';

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  const { id } = request.query;

  if (request.method === 'POST') {
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

    const body = JSON.parse(request.body);
    const social = socials.find((s) => s.id === Number(body.id));
    const key = `portfolio:social:${social.id}:ping`;
    const ping = await redis.get(key);

    if (ping && !body.ping) {
      await redis.del(key);
    } else if (!ping && body.ping) {
      await redis.set(key, new Date().toISOString(), 'EX', 60 * 60 * 24 * 3);
    }

    const pingExist = await redis.get(key);

    return response.status(200).json({
      success: true,
      message: 'Pomyślnie ustawiono ping dla wybranego sociala.',
      social,
      ping: pingExist !== null,
    });
  }

  try {
    const social = socials.find((s) => s.id === Number(id));

    const key = `portfolio:social:${social.id}:ping`;
    const ping = await redis.get(key);

    return response.status(200).json({
      social,
      ping: ping !== null,
    });
  } catch (error) {
    return response.json({
      status: 'error',
      message: 'Ups! Serwer napotkał problem.',
    });
  }
}
