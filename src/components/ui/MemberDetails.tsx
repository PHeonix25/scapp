'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  BackArrowIcon,
  LoadingSpinnerCircle,
  Plus,
} from '@/components/ui/lucide-icons';
import type { ClubworxMember } from '@/lib/clubworx/types';

import { saveMemberToDatabase } from '../../app/members/[contactKey]/actions';

interface MemberDetailsProps {
  member: ClubworxMember;
  contactKey: string;
}

interface SaveResult {
  success: boolean;
  message: string;
  isNew?: boolean;
  error?: string;
}

export function MemberDetails({ member, contactKey }: MemberDetailsProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);

  const handleAddSkill = async () => {
    try {
      setIsSaving(true);
      setSaveResult(null);

      const result = await saveMemberToDatabase(contactKey, member);

      if (result.success) {
        setSaveResult({
          success: true,
          message: result.isNew
            ? 'Member successfully added to the database!'
            : 'Member already exists in the database.',
        });

        // Refresh the page to show updated data
        router.refresh();
      } else {
        setSaveResult({
          success: false,
          message: result.error ?? 'Failed to save member.',
        });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      setSaveResult({
        success: false,
        message: 'An unexpected error occurred while saving the member.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Link
          href='/members'
          className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-4'
        >
          <BackArrowIcon className='h-4 w-4 mr-1' />
          Back to Members
        </Link>

        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>
            {member.first_name} {member.last_name}
          </h1>

          <button
            onClick={handleAddSkill}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isSaving
                ? 'bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isSaving ? (
              <>
                <LoadingSpinnerCircle className='animate-spin -ml-1 mr-2 h-4 w-4' />
                Saving...
              </>
            ) : (
              <>
                <Plus className='-ml-1 mr-2 h-5 w-5' />
                Add to Database
              </>
            )}
          </button>
        </div>

        {member.email && <p className='text-gray-600 mt-1'>{member.email}</p>}
      </div>

      {saveResult && (
        <div
          className={`mb-6 p-4 rounded-md ${
            saveResult.success
              ? 'bg-green-50 text-green-800'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {saveResult.message}
        </div>
      )}
    </div>
  );
}
