'use client';

import { useState } from 'react';

import { CircusButton, CircusCard, CircusLinkButton } from '@/components/ui';
import { trpc } from '@/utils/trpc';

export default function ClassPlansPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const { data: classes, isLoading: classesLoading } =
    trpc.circus.getClasses.useQuery();
  const {
    data: classPlans,
    isLoading: plansLoading,
    refetch,
  } = trpc.circus.getClassPlans.useQuery({
    classId: selectedClassId || undefined,
  });

  const deleteClassPlan = trpc.circus.deleteClassPlan.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async (classPlanId: string) => {
    if (window.confirm('Are you sure you want to delete this class plan?')) {
      await deleteClassPlan.mutateAsync({ classPlanId });
    }
  };

  if (classesLoading) return <div>Loading classes...</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Class Plans</h1>
        <div className='flex space-x-2'>
          <CircusLinkButton
            link='/class-plans/create'
            text='Create Class Plan'
          />
        </div>
      </div>

      {/* Class Filter */}
      <div className='mb-6'>
        <label
          htmlFor='class-filter'
          className='block text-sm font-medium text-muted-foreground mb-2'
        >
          Filter by Class
        </label>
        <select
          id='class-filter'
          value={selectedClassId}
          onChange={e => setSelectedClassId(e.target.value)}
          className='border border-gray-300 rounded-md px-3 py-2 w-full max-w-md'
        >
          <option value=''>All Classes</option>
          {classes?.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name} - {cls.instructor.user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Class Plans List */}
      {plansLoading ? (
        <div>Loading class plans...</div>
      ) : (
        <div className='grid gap-6'>
          {classPlans?.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No class plans found. Create your first class plan!
            </div>
          ) : (
            classPlans?.map(plan => (
              <CircusCard key={plan.id}>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-xl font-semibold'>{plan.title}</h3>
                    <p className='text-card-foreground'>{plan.class.name}</p>
                  </div>
                  <div className='flex space-x-4'>
                    <CircusLinkButton
                      link={`/class-plans/${plan.id}`}
                      text='View'
                    />
                    <CircusLinkButton
                      link={`/class-plans/${plan.id}/edit`}
                      text='Edit'
                    />
                    <CircusButton
                      action={() => handleDelete(plan.id)}
                      disabled={deleteClassPlan.isPending}
                      text='Delete'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Instructor:
                    </span>
                    <p>{plan.class.instructor.user.name}</p>
                  </div>
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Start Date:
                    </span>
                    <p>{new Date(plan.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Duration:
                    </span>
                    <p>{plan.duration} minutes</p>
                  </div>
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Skills:
                    </span>
                    <p>{plan.skills.length} skills planned</p>
                  </div>
                </div>

                {plan.description && (
                  <div className='mb-4'>
                    <span className='font-medium text-muted-foreground'>
                      Description:
                    </span>
                    <p>{plan.description}</p>
                  </div>
                )}

                {plan.skills.length > 0 && (
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Skills:
                    </span>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {plan.skills.slice(0, 5).map(planSkill => (
                        <span
                          key={planSkill.id}
                          className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'
                        >
                          {planSkill.skill.name}
                        </span>
                      ))}
                      {plan.skills.length > 5 && (
                        <span className='text-muted-foreground text-xs'>
                          +{plan.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CircusCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}
