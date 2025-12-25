import { notFound } from 'next/navigation';

import { StudentSkillTracking } from '@/components/ui/StudentSkillTracking';
import { trpcServer } from '@/server/trpc-server';
import { ClubworxMember } from '@/lib/clubworx/types';

interface PageProps {
  params: Promise<{
    contactKey: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MemberPage({ params }: PageProps) {
  const resolvedParams = await params;
  const contactKey = Array.isArray(resolvedParams.contactKey)
    ? resolvedParams.contactKey[0]
    : resolvedParams.contactKey;

  try {
    // Search for member by contact key
    const searchResponse = await trpcServer.clubworx.getMembersSearch({
      query: contactKey,
    });

    // Extract the first member from the search results
    const member = searchResponse.payload?.[0] as ClubworxMember | undefined;
    // console.info('👨‍🎓 Member Info', member);
    if (member) {
      return (
        <div className='container mx-auto p-6'>
          <div className='mb-8'>
            <h1 className='text-2xl font-bold mb-2'>
              {member.first_name} {member.last_name}
            </h1>
            <p className='text-gray-600'>{member.email}</p>
            <p className='text-sm text-gray-500'>
              Contact Key: {member.contact_key}
            </p>
          </div>

          <StudentSkillTracking
            studentId={member.contact_key}
            studentName={`${member.first_name} ${member.last_name}`}
          />
        </div>
      );
    }

    return notFound();
  } catch (error) {
    console.error('Error fetching member:', error);
    return notFound();
  }
}

// This helps with static generation
export const dynamic = 'force-dynamic'; // Force dynamic rendering

// Add this to opt out of static generation at build time
export const dynamicParams = true; // true (default): Dynamic segments not included in generateStaticParams are generated on demand

// This tells Next.js which paths to pre-render at build time
export async function generateStaticParams() {
  // Return an empty array to opt out of static generation at build time
  // You can also fetch member IDs here if you want to pre-render specific pages
  return [];
}
