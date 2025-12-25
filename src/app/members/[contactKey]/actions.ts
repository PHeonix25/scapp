'use server';

import { UserRole, type User } from '@prisma/client';

import type { ClubworxMember } from '@/lib/clubworx/types';
import { trpcServer } from '@/server/trpc-server';
import type { ClubworxUser } from '@/types';

interface SaveMemberResult {
  success: boolean;
  user?: User;
  isNew?: boolean;
  error?: string;
}

function generateTemporaryPassword(): string {
  return Math.random().toString(36).slice(-8);
}

export async function saveMemberToDatabase(
  contactKey: string,
  memberData: ClubworxMember
): Promise<SaveMemberResult> {
  try {
    const existingUser = await trpcServer.circus.getUserByClubworxId({
      clubworxId: contactKey,
    });

    if (existingUser) {
      return {
        success: true,
        user: existingUser,
        isNew: false,
      };
    }
    const userData = {
      name: `${memberData.first_name} ${memberData.last_name}`.trim(),
      email: memberData.email || `${memberData.contact_key}@clubworx.com`,
      phone: memberData.phone || '',
      address: '',
      gender: 'UNSPECIFIED',
      username: memberData.contact_key,
      password: generateTemporaryPassword(),
      role: UserRole.STUDENT,
      clubworxId: contactKey,
    } as unknown as ClubworxUser;

    const user = await trpcServer.circus.createUser(userData);
    return {
      success: true,
      user,
      isNew: true,
    };
  } catch (error) {
    console.error('Error saving member to database:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to save member to database',
    };
  }
}
