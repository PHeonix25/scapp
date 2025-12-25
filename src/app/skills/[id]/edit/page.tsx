'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import type { Apparatus, Level } from '@/generated/prisma';

import { trpc } from '@/utils/trpc';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.id as string;

  const { data: skills } = trpc.circus.getSkills.useQuery();
  const { data: enums } = trpc.circus.getEnums.useQuery();
  const skill = skills?.find(s => s.id === skillId);

  // Note: We'd need to add an updateSkill endpoint to make this functional
  // For now, this is just the UI structure

  // Derive initial form data from skill
  const initialFormData = useMemo(() => {
    if (!skill) {
      return {
        name: '',
        core: false,
        apparatus: '' as Apparatus | '',
        level: '' as Level | '',
        taughtIn: '',
        notes: '',
        cues: '',
      };
    }
    return {
      name: skill.name,
      core: skill.core,
      apparatus: skill.apparatus,
      level: skill.level,
      taughtIn: skill.taughtIn,
      notes: skill.notes ?? '',
      cues: skill.cues ?? '',
    };
  }, [skill]);

  // User edits (starts as empty form, gets filled as user edits)
  const [formData, setFormData] = useState({
    name: '',
    core: false,
    apparatus: '' as Apparatus | '',
    level: '' as Level | '',
    taughtIn: '',
    notes: '',
    cues: '',
  });

  // Use derived initial data if form hasn't been modified yet
  const displayFormData =
    formData.name === '' &&
    !formData.core &&
    formData.apparatus === '' &&
    formData.level === '' &&
    formData.taughtIn === '' &&
    formData.notes === '' &&
    formData.cues === ''
      ? initialFormData
      : formData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement skill update functionality
    alert('Skill update functionality not yet implemented');
  };

  if (!skill) {
    return <div className='text-muted-foreground'>Loading skill...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
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
                <span className='text-gray-500'>Edit</span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className='text-3xl font-bold mb-6'>Edit Skill</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-card shadow-md rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4 text-card-foreground'>
              Basic Information
            </h2>

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='skill-name'
                  className='block text-sm font-medium text-muted-foreground mb-2'
                >
                  Skill Name *
                </label>
                <input
                  id='skill-name'
                  type='text'
                  value={displayFormData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='border border-input rounded-md px-3 py-2 w-full bg-background text-foreground focus:border-ring focus:ring-ring'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='skill-apparatus'
                    className='block text-sm font-medium text-muted-foreground mb-2'
                  >
                    Apparatus *
                  </label>
                  <select
                    id='skill-apparatus'
                    value={displayFormData.apparatus}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        apparatus: e.target.value as Apparatus,
                      })
                    }
                    className='border border-input rounded-md px-3 py-2 w-full bg-background text-foreground focus:border-ring focus:ring-ring'
                    required
                  >
                    <option value=''>Select apparatus</option>
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
                    htmlFor='skill-level'
                    className='block text-sm font-medium text-muted-foreground mb-2'
                  >
                    Level *
                  </label>
                  <select
                    id='skill-level'
                    value={displayFormData.level}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        level: e.target.value as Level,
                      })
                    }
                    className='border border-input rounded-md px-3 py-2 w-full bg-background text-foreground focus:border-ring focus:ring-ring'
                    required
                  >
                    <option value=''>Select level</option>
                    {enums &&
                      Object.values(enums.Level).map(level => (
                        <option key={level} value={level}>
                          {level.replace('_', ' ')}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor='skill-taught-in'
                  className='block text-sm font-medium text-muted-foreground mb-2'
                >
                  Taught In (comma-separated levels)
                </label>
                <input
                  id='skill-taught-in'
                  type='text'
                  value={displayFormData.taughtIn}
                  onChange={e =>
                    setFormData({ ...formData, taughtIn: e.target.value })
                  }
                  className='border border-input rounded-md px-3 py-2 w-full bg-background text-foreground focus:border-ring focus:ring-ring'
                  placeholder='e.g., BEGINNER,TECH_1,TECH_2'
                />
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='core'
                  checked={displayFormData.core}
                  onChange={e =>
                    setFormData({ ...formData, core: e.target.checked })
                  }
                  className='h-4 w-4 text-blue-600 mr-2'
                />
                <label
                  htmlFor='core'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Core Skill
                </label>
              </div>
            </div>
          </div>

          <div className='bg-card shadow-md rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4 text-card-foreground'>
              Teaching Information
            </h2>

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='skill-notes'
                  className='block text-sm font-medium text-muted-foreground mb-2'
                >
                  Notes
                </label>
                <textarea
                  id='skill-notes'
                  value={displayFormData.notes}
                  onChange={e =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className='border border-input rounded-md px-3 py-2 w-full h-32 bg-background text-foreground focus:border-ring focus:ring-ring'
                  rows={4}
                  placeholder='General notes about this skill...'
                />
              </div>

              <div>
                <label
                  htmlFor='skill-cues'
                  className='block text-sm font-medium text-muted-foreground mb-2'
                >
                  Teaching Cues
                </label>
                <textarea
                  id='skill-cues'
                  value={displayFormData.cues}
                  onChange={e =>
                    setFormData({ ...formData, cues: e.target.value })
                  }
                  className='border border-input rounded-md px-3 py-2 w-full h-32 bg-background text-foreground focus:border-ring focus:ring-ring'
                  rows={4}
                  placeholder='Teaching cues and instructions...'
                />
              </div>
            </div>
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
              className='bg-primary text-primary-foreground hover:bg-primary/80 font-bold py-2 px-4 rounded'
            >
              Save Changes
            </button>
          </div>
        </form>

        <div className='mt-8 p-4 bg-accent/10 border border-accent rounded-md'>
          <p className='text-sm text-accent-foreground'>
            <strong>Note:</strong> Skill editing functionality is not yet fully
            implemented. This page shows the UI structure for future
            development.
          </p>
        </div>
      </div>
    </div>
  );
}
