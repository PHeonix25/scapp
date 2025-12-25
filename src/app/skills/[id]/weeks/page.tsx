'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { trpc } from '@/utils/trpc';

export default function EditSkillWeeksPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.id as string;

  const { data: skills } = trpc.circus.getSkills.useQuery();
  const skill = skills?.find(s => s.id === skillId);

  // Derive initial selected weeks from skill data
  const initialSelectedWeeks = useMemo(() => {
    if (!skill) return [];
    try {
      const applicableWeeks = Array.isArray(skill.applicableWeeks)
        ? skill.applicableWeeks
        : JSON.parse(skill.applicableWeeks as string);
      return Array.isArray(applicableWeeks) ? applicableWeeks : [];
    } catch (error) {
      console.error('Error parsing applicable weeks:', error);
      return [];
    }
  }, [skill]);

  // User selections (starts empty, can be modified)
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  // Use initial weeks if user hasn't modified them yet
  const displayWeeks = selectedWeeks.length > 0 ? selectedWeeks : initialSelectedWeeks;

  const updateSkillWeeks = trpc.circus.updateSkillApplicableWeeks.useMutation({
    onSuccess: () => {
      router.push('/skills');
    },
    onError: error => {
      alert(`Error: ${error.message}`);
    },
  });

  const toggleWeek = (week: number) => {
    setSelectedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week].sort((a, b) => a - b)
    );
  };

  const selectRange = (start: number, end: number) => {
    const range: number[] = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    setSelectedWeeks(prev => {
      const newWeeks = [...prev];
      range.forEach(week => {
        if (!newWeeks.includes(week)) {
          newWeeks.push(week);
        }
      });
      return newWeeks.sort((a, b) => a - b);
    });
  };

  const clearAll = () => {
    setSelectedWeeks([]);
  };

  const selectAll = () => {
    const allWeeks = Array.from({ length: 52 }, (_, i) => i + 1);
    setSelectedWeeks(allWeeks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSkillWeeks.mutateAsync({
      skillId,
      applicableWeeks: displayWeeks,
    });
  };

  if (!skill) {
    return <div className='text-muted-foreground'>Loading skill...</div>;
  }

  // Generate weeks grid (52 weeks)
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Breadcrumb */}
        <nav className='flex mb-6' aria-label='Breadcrumb'>
          <ol className='inline-flex items-center space-x-1 md:space-x-3'>
            <li className='inline-flex items-center'>
              <Link
                href='/skills'
                className='text-gray-700 hover:text-blue-600'
              >
                Skills
              </Link>
            </li>
            <li>
              <div className='flex items-center'>
                <span className='mx-2 text-gray-400'>/</span>
                <Link
                  href={`/skills/${skillId}`}
                  className='text-gray-700 hover:text-blue-600'
                >
                  {skill.name}
                </Link>
              </div>
            </li>
            <li>
              <div className='flex items-center'>
                <span className='mx-2 text-gray-400'>/</span>
                <span className='text-gray-500'>Edit Weeks</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-foreground'>
            Edit Applicable Weeks
          </h1>
          <p className='text-muted-foreground text-lg'>{skill.name}</p>
          <p className='text-muted-foreground'>
            {skill.apparatus.replace('_', ' ')} -{' '}
            {skill.level.replace('_', ' ')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-card shadow-md rounded-lg p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-card-foreground'>
                Select Weeks ({displayWeeks.length} selected)
              </h2>
              <div className='flex space-x-2'>
                <button
                  type='button'
                  onClick={clearAll}
                  className='bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold py-1 px-3 rounded text-sm'
                >
                  Clear All
                </button>
                <button
                  type='button'
                  onClick={selectAll}
                  className='bg-primary text-primary-foreground hover:bg-primary/80 font-bold py-1 px-3 rounded text-sm'
                >
                  Select All
                </button>
              </div>
            </div>

            {/* Quick Range Selectors */}
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-700 mb-2'>
                Quick Select Ranges:
              </h3>
              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={() => selectRange(1, 13)}
                  className='bg-green-100 hover:bg-green-200 text-green-800 text-xs px-3 py-1 rounded'
                >
                  Q1 (Weeks 1-13)
                </button>
                <button
                  type='button'
                  onClick={() => selectRange(14, 26)}
                  className='bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded'
                >
                  Q2 (Weeks 14-26)
                </button>
                <button
                  type='button'
                  onClick={() => selectRange(27, 39)}
                  className='bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded'
                >
                  Q3 (Weeks 27-39)
                </button>
                <button
                  type='button'
                  onClick={() => selectRange(40, 52)}
                  className='bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs px-3 py-1 rounded'
                >
                  Q4 (Weeks 40-52)
                </button>
              </div>
            </div>

            {/* Weeks Grid */}
            <div className='grid grid-cols-8 sm:grid-cols-10 md:grid-cols-13 gap-2 mb-6'>
              {weeks.map(week => (
                <button
                  key={week}
                  type='button'
                  onClick={() => toggleWeek(week)}
                  className={`
                    h-10 w-full text-sm font-medium rounded border-2 transition-colors
                    ${
                      displayWeeks.includes(week)
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {week}
                </button>
              ))}
            </div>

            {/* Selected Weeks Summary */}
            {displayWeeks.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-sm font-medium text-muted-foreground mb-2'>
                  Selected Weeks:
                </h3>
                <div className='flex flex-wrap gap-1'>
                  {displayWeeks.map(week => (
                    <span
                      key={week}
                      className='bg-primary/10 text-primary text-xs px-2 py-1 rounded flex items-center'
                    >
                      {week}
                      <button
                        type='button'
                        onClick={() => toggleWeek(week)}
                        className='ml-1 text-primary hover:text-primary/80'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={() => router.back()}
              className='bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold py-2 px-4 rounded'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={updateSkillWeeks.isPending}
              className='bg-primary text-primary-foreground hover:bg-primary/80 font-bold py-2 px-4 rounded disabled:opacity-50'
            >
              {updateSkillWeeks.isPending ? 'Saving...' : 'Save Weeks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
