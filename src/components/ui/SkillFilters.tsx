'use client';

import { Search as SearchIconSolid } from '@/components/ui/lucide-icons';
import { Apparatus, Level } from '@/types';

interface SkillFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  apparatusFilter: string;
  onApparatusChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  filteredCount: number;
}

export function SkillFilters({
  searchTerm,
  onSearchChange,
  apparatusFilter,
  onApparatusChange,
  levelFilter,
  onLevelChange,
  filteredCount,
}: SkillFiltersProps) {
  return (
    <div className='mb-6 bg-card p-4 rounded-lg shadow'>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <SearchIconSolid className='h-5 w-5 text-muted-foreground' />
          </div>
          <input
            type='text'
            placeholder='Search skills...'
            className='pl-10 w-full rounded-md border-input shadow-sm focus:border-ring focus:ring-ring bg-background text-foreground'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className='rounded-md border-input shadow-sm focus:border-ring focus:ring-ring bg-background text-foreground'
          value={apparatusFilter}
          onChange={e => onApparatusChange(e.target.value)}
        >
          <option value='all'>All Apparatus</option>
          {Object.entries(Apparatus)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => (
              <option key={key} value={key}>
                {value as string}
              </option>
            ))}
        </select>

        <select
          className='rounded-md border-input shadow-sm focus:border-ring focus:ring-ring bg-background text-foreground'
          value={levelFilter}
          onChange={e => onLevelChange(e.target.value)}
        >
          <option value='all'>All Levels</option>
          {Object.entries(Level)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => (
              <option key={key} value={key}>
                {value as string}
              </option>
            ))}
        </select>

        <div className='text-sm text-muted-foreground flex items-center'>
          {filteredCount} skills found
        </div>

        <button
          onClick={() => {
            onSearchChange('');
            onApparatusChange('all');
            onLevelChange('all');
          }}
          className='px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring'
          disabled={
            !searchTerm && apparatusFilter === 'all' && levelFilter === 'all'
          }
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
