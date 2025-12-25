'use client';

import { useMemo } from 'react';

import {
  CircusLinkButton,
  ErrorState,
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { ClubworxEvent } from '@/lib/clubworx/types';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export default function Page() {
  // const { data: classes = [], isLoading } = trpc.circus.getClasses.useQuery();
  const dateRange = useMemo(() => {
    // Use start of day to make dates more stable
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 2); // Go three days in the future
    toDate.setHours(23, 59, 59, 999);

    console.log('Date range:', { from: fromDate, to: toDate });
    return { from: fromDate, to: toDate };
  }, []);

  const {
    data: eventData,
    isLoading,
    error,
  } = trpc.clubworx.getClasses.useQuery(dateRange);

  if (isLoading) {
    return <div>Loading classes...</div>;
  }

  if (error || !eventData?.success) {
    return <ErrorState message='Something went wrong fetching classes' />;
  }

  let classes: ClubworxEvent[] = eventData.payload;

  // Filter to only match for classes on the first returned day:
  const dateOnly = (d: string) => new Date(d).setHours(0, 0, 0);
  if (classes.length > 0 && classes[0]?.event_start_at) {
    const firstDay = dateOnly(classes[0]?.event_start_at);
    classes = classes.filter(e => dateOnly(e.event_start_at) == firstDay);
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Upcoming Classes...</h1>
      </div>

      {(!classes || classes.length == 0) && (
        <ErrorState message='No classes available' />
      )}

      {classes && classes.length > 0 && (
        <div className='bg-card shadow overflow-hidden sm:rounded-lg'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader className='hidden sm:table-header-group'>
                <TableRow className='text-left text-xs uppercase'>
                  <TableHeadCell className='w-30'>Start Time</TableHeadCell>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Instructor</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map(cls => (
                  <TableRow key={cls.event_id}>
                    <TableCell>
                      <Link href={`/classes/${cls.event_id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Start Time
                        </div>
                        <div className='whitespace-nowrap text-sm text-accent-foreground'>
                          {new Date(cls.event_start_at).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/classes/${cls.event_id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Name
                        </div>
                        <div className='text-accent-foreground'>
                          {cls.event_name}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/classes/${cls.event_id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Instructor
                        </div>
                        <div className='text-sm text-accent-foreground'>
                          {cls.instructor_name ?? 'TBD'}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col sm:flex-row gap-1.5 sm:gap-2'>
                        <CircusLinkButton
                          link={`/class-plans?classId=${cls.event_id}`}
                          text='View Plans'
                          size='sm'
                          className='w-full sm:w-auto'
                        />
                        <CircusLinkButton
                          link={`/class-plans/create?classId=${cls.event_id}`}
                          text='Create Plan'
                          size='sm'
                          className='w-full sm:w-auto'
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
