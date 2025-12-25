// src/app/skills/new/page.tsx
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Apparatus, Level } from '@/generated/prisma';

export default function NewSkillPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    apparatus: '',
    level: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create skill
    router.push('/skills');
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Add New Skill</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='skill-name'
            className='block text-sm font-medium text-muted-foreground'
          >
            Name
          </label>
          <input
            id='skill-name'
            type='text'
            className='mt-1 block w-full rounded-md border-input shadow-sm bg-background text-foreground focus:border-ring focus:ring-ring'
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label
            htmlFor='skill-description'
            className='block text-sm font-medium text-muted-foreground'
          >
            Description
          </label>
          <textarea
            id='skill-description'
            className='mt-1 block w-full rounded-md border-input shadow-sm bg-background text-foreground focus:border-ring focus:ring-ring'
            rows={3}
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor='skill-apparatus'
            className='block text-sm font-medium text-muted-foreground'
          >
            Apparatus
          </label>
          <select
            className='mt-1 block w-full rounded-md border-input shadow-sm bg-background text-foreground focus:border-ring focus:ring-ring'
            value={formData.apparatus}
            onChange={e =>
              setFormData({ ...formData, apparatus: e.target.value })
            }
            required
          >
            <option value=''>Select an apparatus</option>
            {Object.entries(Apparatus).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='skill-level'
            className='block text-sm font-medium text-muted-foreground'
          >
            Level
          </label>
          <select
            id='skill-level'
            className='mt-1 block w-full rounded-md border-input shadow-sm bg-background text-foreground focus:border-ring focus:ring-ring'
            value={formData.level}
            onChange={e => setFormData({ ...formData, level: e.target.value })}
            required
          >
            <option value=''>Select a level</option>
            {Object.entries(Level).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className='flex justify-end space-x-3'>
          <button
            type='button'
            onClick={() => router.push('/skills')}
            className='px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-accent'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
