'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { PageHeader, SkillFilters } from '@/components/ui';
import { ArrowUpDown as SortUpDownIcon } from '@/components/ui/lucide-icons';
import { Apparatus, Level } from '@/types';
import { trpc } from '@/utils/trpc';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'apparatus' | 'level';

export default function Page() {
  const router = useRouter();
  const {
    data: skills = [],
    isLoading,
    error,
  } = trpc.circus.getSkills.useQuery();

  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: 'name', direction: 'asc' });

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [apparatusFilter, setApparatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Handle sort when column header is clicked
  const requestSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Apply sorting and filtering
  const filteredAndSortedSkills = useMemo(() => {
    let result = [...(skills ?? [])];

    // Apply filters
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        skill =>
          skill.name.toLowerCase().includes(term) ??
          skill.notes?.toLowerCase().includes(term)
      );
    }

    if (apparatusFilter !== 'all') {
      result = result.filter(skill => skill.apparatus === apparatusFilter);
    }

    if (levelFilter !== 'all') {
      result = result.filter(skill => skill.level === levelFilter);
    }

    // Apply sorting
    if (sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field]?.toString().toLowerCase() ?? '';
        const bValue = b[sortConfig.field]?.toString().toLowerCase() ?? '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [skills, searchTerm, apparatusFilter, levelFilter, sortConfig]);

  // Get sort indicator
  const getSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <div className='bg-destructive/10 border border-destructive/20 rounded-md p-4'>
          <div className='text-destructive'>
            Error loading skills: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <PageHeader
        title='Skills'
        action={{ href: '/skills/new', label: 'Add New Skill' }}
      />

      <SkillFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        apparatusFilter={apparatusFilter}
        onApparatusChange={setApparatusFilter}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        filteredCount={filteredAndSortedSkills.length}
      />

      <div className='bg-card shadow overflow-hidden sm:rounded-lg'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-border'>
            <thead className='bg-muted'>
              <tr>
                <th className='px-2 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-16'>
                  {/* Empty header for thumbnail column */}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-accent'
                  onClick={() => requestSort('name')}
                >
                  <div className='flex items-center'>
                    Name
                    <SortUpDownIcon className='ml-1 h-4 w-4' />
                    <span className='ml-1'>{getSortIndicator('name')}</span>
                  </div>
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-accent'
                  onClick={() => requestSort('apparatus')}
                >
                  <div className='flex items-center'>
                    Apparatus
                    <SortUpDownIcon className='ml-1 h-4 w-4' />
                    <span className='ml-1'>
                      {getSortIndicator('apparatus')}
                    </span>
                  </div>
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-accent'
                  onClick={() => requestSort('level')}
                >
                  <div className='flex items-center'>
                    Level
                    <SortUpDownIcon className='ml-1 h-4 w-4' />
                    <span className='ml-1'>{getSortIndicator('level')}</span>
                  </div>
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Applicable Weeks
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-surface divide-y divide-border'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-4 text-center text-sm text-muted-foreground'
                  >
                    Loading skills...
                  </td>
                </tr>
              ) : filteredAndSortedSkills.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-4 text-center text-sm text-muted-foreground'
                  >
                    No skills found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedSkills.map(skill => {
                  const applicableWeeks = (() => {
                    try {
                      return Array.isArray(skill.applicableWeeks)
                        ? skill.applicableWeeks
                        : JSON.parse(skill.applicableWeeks as string);
                    } catch {
                      return [];
                    }
                  })();

                  return (
                    <tr key={skill.id} className='hover:bg-accent/50'>
                      <td className='px-2 py-4 whitespace-nowrap'>
                        <div className='h-20 w-20 bg-muted flex items-center justify-center overflow-hidden'>
                          <svg
                            className='h-6 w-6 text-muted-foreground'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          />
                        </div>
                      </td>
                      <td
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground cursor-pointer'
                        onClick={() => router.push(`/skills/${skill.id}`)}
                      >
                        {skill.name}
                        {skill.notes && (
                          <p className='text-xs text-muted-foreground mt-1 truncate'>
                            {skill.notes}
                          </p>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                        {Apparatus[skill.apparatus as keyof typeof Apparatus]}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                        {Level[skill.level as keyof typeof Level]}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                        {applicableWeeks.length > 0 ? (
                          <div className='flex flex-wrap gap-1'>
                            {applicableWeeks.slice(0, 5).map((week: number) => (
                              <span
                                key={week}
                                className='bg-primary/10 text-primary text-xs px-2 py-1 rounded'
                              >
                                {week}
                              </span>
                            ))}
                            {applicableWeeks.length > 5 && (
                              <span className='text-muted-foreground text-xs'>
                                +{applicableWeeks.length - 5} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className='text-muted-foreground text-xs'>
                            No weeks set
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            router.push(`/skills/${skill.id}/weeks`);
                          }}
                          className='text-primary hover:text-primary/80 text-sm'
                        >
                          Edit Weeks
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
