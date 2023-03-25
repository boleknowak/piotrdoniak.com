import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { UserInterface } from '@/interfaces/UserInterface';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session) return null;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) return session;

      session.user = {
        id: user.id,
        name: user.name,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        image: user.image,
        is_authorized: user.is_authorized,
      } as UserInterface;

      return session;
    },
  },
};

export default NextAuth(authOptions);
