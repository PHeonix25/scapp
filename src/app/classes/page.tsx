import Link from 'next/link';
import { gymMasterClient } from '@/lib/gymmaster/client';
import type { GymMasterClass } from '@/lib/gymmaster/types';

export const revalidate = 60; // cache for a minute

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function Page() {
  const today = new Date();
  const weekParam = isoDate(today);

  // Fetch upcoming classes for the week containing today
  const classes = (await gymMasterClient.getV2Classes(weekParam)) ?? [];

  // Filter to classes that occur today
  const todays = (classes as GymMasterClass[]).filter(c => {
    const arrival = c.arrival ?? '';
    return arrival.startsWith(isoDate(today));
  });

  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Today&apos;s Classes (GymMaster)</h1>
      </div>

      {todays.length === 0 ? (
        <p>No classes found for today.</p>
      ) : (
        <ul className='space-y-4'>
          {todays.map(cls => (
            <li key={cls.id} className='p-4 bg-white rounded shadow'>
              <div className='flex justify-between items-center'>
                <div>
                  <div className='font-semibold'>{cls.classname}</div>
                  <div className='text-sm text-muted-foreground'>
                    {cls.start_str ?? cls.starttime} — {cls.end_str ?? cls.endtime}
                  </div>
                </div>
                <div>
                  <Link href={`/gymmaster/classes/${cls.id}`} className='text-blue-600 hover:underline'>
                    View Attendees
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
