'use client';

import { useMemo, useState } from 'react';

import {
  Apparatus,
  Level,
  type SkillProgressStatus,
  type SkillWithProgress,
} from '@/types';
import { trpc } from '@/utils/trpc';

interface StudentSkillTrackingProps {
  studentId: string;
  studentName: string;
}

const statusColors = {
  NOT_ATTEMPTED: 'bg-muted text-muted-foreground',
  ATTEMPTED: 'bg-yellow-100 text-yellow-800',
  COMPETENT: 'bg-blue-100 text-blue-800',
  MASTERED: 'bg-green-100 text-green-800',
  EXCEPTED: 'bg-destructive/10 text-destructive',
};

const statusLabels = {
  NOT_ATTEMPTED: 'Not Attempted',
  ATTEMPTED: 'Attempted',
  COMPETENT: 'Competent',
  MASTERED: 'Mastered',
  EXCEPTED: 'Excepted',
};

export function StudentSkillTracking({
  studentId,
  studentName,
}: StudentSkillTrackingProps) {
  const [apparatusFilter, setApparatusFilter] = useState<Apparatus | 'all'>(
    'all'
  );
  const [levelFilter, setLevelFilter] = useState<Level | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillWithProgress | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: skills = [],
    isLoading,
    refetch,
  } = trpc.circus.getStudentSkillProgress.useQuery({
    studentId,
    apparatusFilter: apparatusFilter !== 'all' ? apparatusFilter : undefined,
    levelFilter: levelFilter !== 'all' ? levelFilter : undefined,
  });

  const updateProgressMutation =
    trpc.circus.updateStudentSkillProgress.useMutation({
      onSuccess: () => {
        refetch();
        setSelectedSkill(null);
        setIsUpdating(false);
      },
      onError: error => {
        console.error('Error updating skill progress:', error);
        setIsUpdating(false);
      },
    });

  const groupedSkills = useMemo(() => {
    const groups: Record<string, SkillWithProgress[]> = {};

    skills.forEach((skill: SkillWithProgress) => {
      const key = `${skill.apparatus}-${skill.level}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key]!.push(skill);
    });

    return groups;
  }, [skills]);

  const handleStatusUpdate = async (
    skillId: string,
    status: SkillProgressStatus,
    notes?: string,
    reason?: string
  ) => {
    setIsUpdating(true);
    await updateProgressMutation.mutateAsync({
      studentId,
      skillId,
      status,
      notes,
      reason,
      assessedBy: 'Current User', // TODO: Get from auth context
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-muted-foreground'>Loading skills...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>
          Skill Progress for {studentName}
        </h2>

        <div className='flex space-x-4'>
          <select
            value={apparatusFilter}
            onChange={e =>
              setApparatusFilter(e.target.value as Apparatus | 'all')
            }
            className='px-3 py-2 border border-gray-300 rounded-md text-sm'
          >
            <option value='all'>All Apparatus</option>
            {Object.values(Apparatus).map(apparatus => (
              <option key={apparatus} value={apparatus}>
                {apparatus.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value as Level | 'all')}
            className='px-3 py-2 border border-gray-300 rounded-md text-sm'
          >
            <option value='all'>All Levels</option>
            {Object.values(Level).map(level => (
              <option key={level} value={level}>
                {level.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(groupedSkills).length === 0 ? (
        <div className='text-center py-8 text-muted-foreground'>
          No skills found for the selected filters.
        </div>
      ) : (
        <div className='space-y-6'>
          {Object.entries(groupedSkills).map(([groupKey, groupSkills]) => {
            const [apparatus, level] = groupKey.split('-');
            return (
              <div key={groupKey} className='bg-white rounded-lg shadow'>
                {apparatus && level && (
                  <div className='px-6 py-4 border-b border-gray-200'>
                    <h3 className='text-lg font-medium'>
                      {apparatus.replace('_', ' ')} - {level.replace('_', ' ')}
                    </h3>
                  </div>
                )}
                <div className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {groupSkills.map(skill => (
                      <div
                        key={skill.id}
                        className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer'
                        onClick={() => setSelectedSkill(skill)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedSkill(skill);
                          }
                        }}
                        role='button'
                        tabIndex={0}
                      >
                        <div className='flex justify-between items-start mb-2'>
                          <h4 className='font-medium text-sm'>{skill.name}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[skill.progressStatus]}`}
                          >
                            {statusLabels[skill.progressStatus]}
                          </span>
                        </div>

                        {skill.notes && (
                          <p className='text-xs text-gray-600 mb-2'>
                            {skill.notes}
                          </p>
                        )}

                        {skill.progressNotes && (
                          <p className='text-xs text-blue-600 italic'>
                            Note: {skill.progressNotes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Skill Update Modal */}
      {selectedSkill && (
        <SkillUpdateModal
          skill={selectedSkill}
          isUpdating={isUpdating}
          onUpdate={handleStatusUpdate}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}

interface SkillUpdateModalProps {
  skill: SkillWithProgress;
  isUpdating: boolean;
  onUpdate: (
    skillId: string,
    status: SkillProgressStatus,
    notes?: string,
    reason?: string
  ) => void;
  onClose: () => void;
}

function SkillUpdateModal({
  skill,
  isUpdating,
  onUpdate,
  onClose,
}: SkillUpdateModalProps) {
  const [status, setStatus] = useState<SkillProgressStatus>(
    skill.progressStatus
  );
  const [notes, setNotes] = useState(skill.progressNotes ?? '');
  const [reason, setReason] = useState(skill.progressReason ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(skill.id, status, notes ?? undefined, reason ?? undefined);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium'>Update Skill Progress</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            ✕
          </button>
        </div>

        <div className='mb-4'>
          <h4 className='font-medium'>{skill.name}</h4>
          <p className='text-sm text-gray-600'>
            {skill.apparatus.replace('_', ' ')} -{' '}
            {skill.level.replace('_', ' ')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='skill-status'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Status
            </label>
            <select
              id='skill-status'
              value={status}
              onChange={e => setStatus(e.target.value as SkillProgressStatus)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              required
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='skill-notes'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Notes (optional)
            </label>
            <textarea
              id='skill-notes'
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              rows={3}
              placeholder='Add any notes about this assessment...'
            />
          </div>

          {status === 'EXCEPTED' && (
            <div>
              <label
                htmlFor='skill-reason'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Reason for Exception
              </label>
              <textarea
                id='skill-reason'
                value={reason}
                onChange={e => setReason(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                rows={2}
                placeholder='Explain why this skill is excepted...'
                required
              />
            </div>
          )}

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
