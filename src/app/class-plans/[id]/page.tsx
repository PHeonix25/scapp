'use client';

import { useParams } from 'next/navigation';

import {
  CircusCard,
  CircusHighlight,
  CircusLinkButton,
  CircusPlaceholder,
} from '@/components/ui';
import { trpc } from '@/utils/trpc';

export default function ClassPlanDetailPage() {
  const params = useParams();
  const classPlanId = params.id as string;

  const {
    data: classPlan,
    isLoading,
    error,
  } = trpc.circus.getClassPlanById.useQuery({
    classPlanId,
  });

  if (isLoading) return <div>Loading class plan...</div>;
  if (error) return <div>Error loading class plan: {error.message}</div>;
  if (!classPlan) return <div>Class plan not found</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-3xl font-bold'>{classPlan.title}</h1>
            <p className='text-card-foreground text-lg'>
              {classPlan.class.name}
            </p>
            <p className='text-muted-foreground italic'>
              Led by {classPlan.class.instructor.user.name}
            </p>
          </div>
          <div className='flex space-x-2'>
            <CircusLinkButton
              link={`/class-plans/${classPlan.id}/edit`}
              text='Edit'
            />
            <CircusLinkButton link={`/class-plans`} text='Back' />
          </div>
        </div>

        {/* Class Plan Details */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Class Plan Details</h2>

          <div className='flex gap-6 mb-2'>
            <div>
              <p className='font-medium text-muted-foreground'>
                Week{' '}
                <span className='text-card-foreground'>
                  {classPlan.weekOfYear}
                </span>{' '}
                , starting{' '}
                <span className='text-card-foreground'>
                  {new Date(classPlan.date).toDateString()}
                </span>{' '}
                &amp; containing{' '}
                <span className='text-card-foreground'>
                  {classPlan.skills.length}
                </span>{' '}
                skills
              </p>
            </div>
          </div>

          {classPlan.description && (
            <div className='mb-6'>
              <p className='mt-2 text-card-foreground'>
                {classPlan.description}
              </p>
            </div>
          )}

          {classPlan.notes && (
            <div>
              <span className='font-medium italic text-muted-foreground'>
                Reminders:
              </span>
              <p className='text-card-foreground'>{classPlan.notes}</p>
            </div>
          )}
        </div>

        {/* Class Information */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Class Information</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <span className='font-medium text-muted-foreground'>
                Class Type:
              </span>
              <p>{classPlan.class.type.split('_').join(' ')}</p>
            </div>
            <div>
              <span className='font-medium text-muted-foreground'>
                Apparatus:
              </span>
              <p>{classPlan.class.apparatus.replace('_', ' ')}</p>
            </div>
            <div>
              <span className='font-medium text-muted-foreground'>Level:</span>
              <p>{classPlan.class.level.replace('_', ' ')}</p>
            </div>
          </div>

          {classPlan.class.enrollments &&
            classPlan.class.enrollments.length > 0 && (
              <div className='mt-4'>
                <span className='font-medium text-muted-foreground'>
                  {classPlan.class.enrollments?.length ?? 0} Enrolled Students:
                </span>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {classPlan.class.enrollments.map(enrollment => (
                    <CircusHighlight key={enrollment.student.id}>
                      <span className='text-secondary-foreground text-sm font-medium px-2.5 py-0.5 rounded'>
                        {enrollment.student.user.name}
                      </span>
                    </CircusHighlight>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Conditioning */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Conditioning</h2>

          <div className='flex gap-6 mb-2'>
            <div>
              <p className='font-medium text-muted-foreground'>
                TBD
                {
                  // TODO - GO AND MAKE A TABLE FOR THIS
                  // This should be attached to skills
                }
              </p>
            </div>
          </div>
        </div>

        {/* Skills List */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Skills ({classPlan.skills.length})
          </h2>

          {classPlan.skills.length === 0 ? (
            <p className='text-muted-foreground'>
              No skills planned for this class.
            </p>
          ) : (
            <div className='space-y-4 columns-1 md:columns-2'>
              {classPlan.skills.map(planSkill => (
                <CircusCard
                  key={planSkill.id}
                  link={`/skills/${planSkill.skill.id}`}
                >
                  <div className='flex gap-4 flex-row'>
                    <p className='text-lg font-medium grow'>
                      {planSkill.skill.name}
                    </p>
                    <CircusPlaceholder text='Image' />
                    <CircusPlaceholder text='Video' />
                  </div>
                </CircusCard>
              ))}
            </div>
          )}
        </div>

        {/* Sequences */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Sequences</h2>

          <div className='flex gap-6 mb-2'>
            <div>
              <p className='font-medium text-foreground'>
                TBD
                {
                  // TODO - GO AND MAKE A TABLE FOR THIS
                  // This is a combination of skills
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
