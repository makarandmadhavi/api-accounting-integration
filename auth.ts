import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';

async function getUser(email: string): Promise<any | undefined> {
    try {
        const user = prisma.Users.findFirst({
            where: {
                EmailAddress: email,
            },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const isValid = await bcrypt.compare(password, user.Password);
                    if (isValid) {
                        return user;
                    }
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});