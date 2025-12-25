'use client';

import { useMemo, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import type { Apparatus, Level } from '@/generated/prisma';

import { trpc } from '@/utils/trpc';

export default function EditClassPlanPage() {
  const router = useRouter();
  const params = useParams();
  const classPlanId = params.id as string;

  const { data: classPlan, isLoading: planLoading } =
    trpc.circus.getClassPlanById.useQuery({
      classPlanId,
    });
  const { data: enums } = trpc.circus.getEnums.useQuery();

  // Get class info from the loaded class plan
  const selectedClass = classPlan?.class;

  // Derive initial skills and week from class plan
  const initialSkills = useMemo(() => {
    return classPlan?.skills.map(s => s.skillId) ?? [];
  }, [classPlan]);

  const initialWeekNumber = useMemo(() => {
    return classPlan?.weekOfYear ?? 1;
  }, [classPlan]);

  // User selections (can be modified from initial values)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillFilters, setSkillFilters] = useState({
    apparatus: undefined as Apparatus | undefined,
    level: undefined as Level | undefined,
  });
  const [weekNumber, setWeekNumber] = useState<number>(1);

  // Use initial values if user hasn't modified them yet
  const displaySkills = selectedSkills.length === 0 ? initialSkills : selectedSkills;
  const displayWeekNumber =
    weekNumber === 1 && initialWeekNumber !== 1 ? initialWeekNumber : weekNumber;

  const { data: skills } = trpc.circus.getSkillsForClassPlan.useQuery({
    apparatus: skillFilters.apparatus ?? selectedClass?.apparatus,
    level: skillFilters.level,
  });

  // Get all skills to ensure selected skills are always available
  const { data: allSkills } = trpc.circus.getSkills.useQuery();
  const { data: suggestedSkillsData } =
    trpc.circus.getSuggestedSkillsForWeek.useQuery(
      {
        weekOfYear: displayWeekNumber,
        apparatus: selectedClass?.apparatus,
        level: skillFilters.level,
      },
      {
        enabled: !!selectedClass,
      }
    );

  const updateClassPlan = trpc.circus.updateClassPlan.useMutation({
    onSuccess: () => {
      router.push(`/class-plans/${classPlanId}`);
    },
    onError: error => {
      window.alert(`Error: ${error.message}`);
    },
  });

  // Generate title based on class apparatus and level
  const generateTitle = () => {
    if (!selectedClass) return '';

    return `${selectedClass.apparatus.replace('_', ' ')} - ${selectedClass.level.replace('_', ' ')} - Week ${displayWeekNumber}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (displaySkills.length === 0) {
      window.alert('Please select at least one skill');
      return;
    }

    const title = generateTitle();

    // Create a date for the selected week
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const weekStart = new Date(
      startOfYear.getTime() + (displayWeekNumber - 1) * 7 * 24 * 60 * 60 * 1000
    );

    await updateClassPlan.mutateAsync({
      classPlanId,
      title,
      date: weekStart.toISOString(),
      skillIds: displaySkills,
    });
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const addSuggestedSkills = () => {
    if (suggestedSkillsData?.length) {
      const suggestedIds = suggestedSkillsData.map(s => s.id);
      setSelectedSkills(prev => {
        const newSkills = suggestedIds.filter(id => !prev.includes(id));
        return [...prev, ...newSkills];
      });
    }
  };

  if (planLoading) return <div>Loading class plan...</div>;
  if (!classPlan) return <div>Class plan not found</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Edit Class Plan</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div className='bg-white shadow-md rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='class-input'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Class
                </label>
                <input
                  id='class-input'
                  type='text'
                  value={`${classPlan.class.name} - ${classPlan.class.instructor.user.name}`}
                  className='border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-100'
                  disabled
                />
                <p className='text-sm text-gray-500 mt-1'>
                  {classPlan.class.apparatus.replace('_', ' ')} -{' '}
                  {classPlan.class.level.replace('_', ' ')}
                </p>
              </div>

              <div>
                <label
                  htmlFor='week-number'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Week Number *
                </label>
                <input
                  id='week-number'
                  type='number'
                  min='1'
                  max='52'
                  value={weekNumber}
                  onChange={e => setWeekNumber(parseInt(e.target.value) || 1)}
                  className='border border-gray-300 rounded-md px-3 py-2 w-full'
                  required
                />
              </div>
            </div>

            {/* Generated Title Preview */}
            {generateTitle() && (
              <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <span className='text-sm font-medium text-blue-800'>
                  Generated Title:
                </span>
                <p className='text-blue-900 font-semibold'>{generateTitle()}</p>
              </div>
            )}
          </div>

          {/* Suggested Skills */}
          {suggestedSkillsData && suggestedSkillsData.length > 0 && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-green-800'>
                  Suggested {selectedClass?.apparatus.replace('_', ' ')} Skills
                  for Week {displayWeekNumber}
                </h2>
                <button
                  type='button'
                  onClick={addSuggestedSkills}
                  className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm'
                >
                  Add All Suggested
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {suggestedSkillsData.map(skill => (
                  <div
                    key={skill.id}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      displaySkills.includes(skill.id)
                        ? 'bg-green-200 border-green-400'
                        : 'bg-white border-green-300 hover:bg-green-100'
                    }`}
                    onClick={() => toggleSkill(skill.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSkill(skill.id);
                      }
                    }}
                    role='button'
                    tabIndex={0}
                  >
                    <div className='font-medium text-green-900'>
                      {skill.name}
                    </div>
                    <div className='text-sm text-green-700'>
                      {skill.apparatus.replace('_', ' ')} -{' '}
                      {skill.level.replace('_', ' ')}
                      {skill.core && (
                        <span className='ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
                          Core
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Selection */}
          <div className='bg-white shadow-md rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>Select Skills</h2>

            {/* Skill Filters */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label
                  htmlFor='apparatus-filter'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Filter by Apparatus
                </label>
                <select
                  id='apparatus-filter'
                  value={skillFilters.apparatus ?? ''}
                  onChange={e =>
                    setSkillFilters({
                      ...skillFilters,
                      apparatus:
                        e.target.value === ''
                          ? undefined
                          : (e.target.value as Apparatus),
                    })
                  }
                  className='border border-gray-300 rounded-md px-3 py-2 w-full'
                >
                  <option value=''>All Apparatus</option>
                  {enums &&
                    Object.values(enums.Apparatus).map(apparatus => (
                      <option key={apparatus} value={apparatus}>
                        {apparatus.replace('_', ' ')}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor='level-filter'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Filter by Level
                </label>
                <select
                  id='level-filter'
                  value={skillFilters.level ?? ''}
                  onChange={e =>
                    setSkillFilters({
                      ...skillFilters,
                      level:
                        e.target.value === ''
                          ? undefined
                          : (e.target.value as Level),
                    })
                  }
                  className='border border-gray-300 rounded-md px-3 py-2 w-full'
                >
                  <option value=''>All Levels</option>
                  {enums &&
                    Object.values(enums.Level).map(level => (
                      <option key={level} value={level}>
                        {level.replace('_', ' ')}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Skills List */}
            <div className='max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4'>
              {(() => {
                // Combine filtered skills with selected skills to ensure selected skills are always visible
                const filteredSkills = skills ?? [];
                const selectedSkillObjects = displaySkills
                  .map(id => allSkills?.find(skill => skill.id === id))
                  .filter(Boolean) as typeof allSkills;

                // Create a unique list of skills (filtered + selected)
                const skillsMap = new Map();
                [...filteredSkills, ...(selectedSkillObjects ?? [])].forEach(
                  skill => {
                    skillsMap.set(skill.id, skill);
                  }
                );
                const skillsList = Array.from(skillsMap.values());

                return skillsList.length === 0 ? (
                  <p className='text-gray-500'>
                    No skills found with current filters
                  </p>
                ) : (
                  <div className='space-y-2'>
                    {skillsList.map(skill => {
                      const isSuggested = suggestedSkillsData?.some(
                        s => s.id === skill.id
                      );
                      const isSelected = displaySkills.includes(skill.id);
                      const matchesFilter = filteredSkills.some(
                        s => s.id === skill.id
                      );

                      return (
                        <label
                          key={skill.id}
                          htmlFor={`skill-${skill.id}`}
                          className={`flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded ${
                            isSelected && !matchesFilter
                              ? 'bg-yellow-50 border border-yellow-200'
                              : ''
                          }`}
                          aria-label={`Select skill: ${skill.name}`}
                        >
                          <input
                            id={`skill-${skill.id}`}
                            type='checkbox'
                            checked={isSelected}
                            onChange={() => toggleSkill(skill.id)}
                            className='h-4 w-4 text-blue-600'
                          />
                          <div className='flex-1'>
                            <div className='flex items-center'>
                              <span className='font-medium'>{skill.name}</span>
                              {isSuggested && (
                                <span className='ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                                  Week {weekNumber}
                                </span>
                              )}
                              {isSelected && !matchesFilter && (
                                <span className='ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded'>
                                  Selected
                                </span>
                              )}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {skill.apparatus.replace('_', ' ')} -{' '}
                              {skill.level.replace('_', ' ')}
                              {skill.core && (
                                <span className='ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
                                  Core
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {displaySkills.length > 0 && (
              <div className='mt-4'>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Selected Skills ({displaySkills.length}):
                </p>
                <div className='flex flex-wrap gap-2'>
                  {displaySkills.map(skillId => {
                    const skill = allSkills?.find(s => s.id === skillId);
                    return skill ? (
                      <span
                        key={skillId}
                        className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center'
                      >
                        {skill.name}
                        <button
                          type='button'
                          onClick={() => toggleSkill(skillId)}
                          className='ml-1 text-blue-600 hover:text-blue-800'
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={() => router.back()}
              className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={updateClassPlan.isPending}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
            >
              {updateClassPlan.isPending ? 'Updating...' : 'Update Class Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
