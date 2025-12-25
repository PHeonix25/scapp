'use client';

import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { trpc } from '@/utils/trpc';
import { CircusLinkButton } from '../../components/ui';

export default function Page() {
  const {
    data: students = [],
    isLoading,
    error,
  } = trpc.circus.getStudents.useQuery();

  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg text-foreground'>Loading students...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <div className='bg-destructive/10 border border-destructive/20 rounded-md p-4'>
          <div className='text-destructive'>
            Error loading students: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Students</h1>
      </div>

      {students?.length === 0 ? (
        <div className='bg-card shadow rounded-lg p-8 text-center'>
          <div className='text-muted-foreground mb-4'>No students found</div>
        </div>
      ) : (
        <div className='bg-card shadow overflow-hidden sm:rounded-lg'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader className='hidden sm:table-header-group'>
                <TableRow className='text-left text-xs uppercase'>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Phone</TableHeadCell>
                  <TableHeadCell>Clubworx ID</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Link href={`/members/${student.id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Name
                        </div>
                        <div className='text-accent-foreground font-medium'>
                          {student.name}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/members/${student.id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Email
                        </div>
                        <div className='text-accent-foreground'>
                          {student.email || '-'}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/members/${student.id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Phone
                        </div>
                        <div className='text-accent-foreground'>
                          {student.phone || '-'}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/members/${student.id}`}>
                        <div className='sm:hidden text-xs text-muted-foreground mb-0.5'>
                          Clubworx ID
                        </div>
                        <div className='text-accent-foreground'>
                          {student.clubworxId || '-'}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col sm:flex-row gap-2'>
                        <CircusLinkButton
                          link={`/members/${student.id}`}
                          text='Edit'
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
