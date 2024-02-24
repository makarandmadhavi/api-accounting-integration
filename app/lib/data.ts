import {
  User,
} from './definitions';
import { auth } from '@/auth';

export async function fetchSessionUser() {
  const session = await auth();
  return session?.user ?? {  } as User;
}
