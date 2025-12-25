'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Loader2 as LoadingSpinner,
  MapPin as LocationMarkerIcon,
  User as UserIcon,
  X as ErrorIcon,
} from '@/components/ui/lucide-icons';
import type { ClubworxBooking } from '@/lib/clubworx/types';
import { trpc } from '@/utils/trpc';

interface ErrorProps {
  classId: string;
  eventId?: string;
  bookings?: boolean;
  classData?: string;
  bookingData?: string;
}

function renderError(message: string, debug: ErrorProps) {
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-red-50 border-l-4 border-red-400 p-4 mb-6'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <ErrorIcon />
          </div>
          <div className='ml-3'>
            <p className='text-sm text-destructive'>
              {message ?? 'Class not found'}
            </p>
          </div>
        </div>
      </div>
      {debug && (
        <div>
          <h2>Debugging information</h2>
          <div className='bg-gray-50 border-l-4 border-gray-400 p-4 mb-6'>
            <div id='debugInfo' className='text-sm text-gray-500 text-pre'>
              <p>Class ID: {debug.classId}</p>
              <p>Event ID: {debug.eventId}</p>
              <hr />
              <p>Bookings Located: {debug.bookings}</p>
              <hr />
              <p>Class Data: {debug.classData}</p>
              <p>Bookings Data: {debug.bookingData}</p>
            </div>
          </div>
        </div>
      )}
      <p></p>
      <Link
        href='/classes'
        className='text-blue-600 hover:text-blue-800 hover:underline'
      >
        &larr; Back to Classes
      </Link>
    </div>
  );
}
export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.classId as string;
  console.log(`Requesting class ${classId}`);
  let errorDebug: ErrorProps = { classId };

  const {
    data: scClass,
    isLoading: isLoadingSC,
    error,
  } = trpc.circus.getClassById.useQuery({ classId });

  errorDebug.classData = JSON.stringify(scClass);
  console.log('Social Circus Class located.');
  const eventId = scClass?.clubworxId.toString() ?? '';
  console.log('Requesting bookings for CW event:', eventId);

  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: clubworxError,
  } = trpc.clubworx.getBookingsForEvent.useQuery(
    { eventId },
    { enabled: !!eventId }
  );

  if (isLoadingSC || isLoadingBookings) return <LoadingSpinner />;
  if (error || !scClass) {
    return renderError(error?.message ?? 'An error occurred.', errorDebug);
  }
  if (!scClass?.clubworxId) {
    return renderError('Class does not have a valid ClubworxId', errorDebug);
  }
  if (clubworxError || !bookingsData?.success) {
    errorDebug = {
      ...errorDebug,
      bookings: bookingsData?.success ?? false,
      bookingData: JSON.stringify(bookingsData),
    };
    return renderError('Clubworx errored out', errorDebug);
  }

  console.log('Bookings loaded!', bookingsData);
  const bookings: ClubworxBooking[] = bookingsData?.payload ?? [];

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString(['en-AU'], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatBookingState = (state: string): string => {
    if (!state) return '';
    return state
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Link
        href='/classes'
        className='inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline mb-6'
      >
        &larr; Back to Classes
      </Link>

      <div className='bg-white rounded-lg shadow overflow-hidden mb-8'>
        <div className='p-6'>
          <div className='flex justify-between items-start'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              {scClass.name}
            </h1>
          </div>

          <div className='flex flex-col md:flex-row md:items-start gap-6 mt-4'>
            <div className='flex-1'>
              <div className='space-y-2 text-sm text-gray-700'>
                <div className='flex items-center'>
                  <CalendarIcon className='h-5 w-5 text-gray-400 mr-2' />
                  <span>{formatDate(scClass.startDate)}</span>
                </div>
                <div className='flex items-center'>
                  <ClockIcon className='h-5 w-5 text-gray-400 mr-2' />
                  <span>
                    {formatTime(scClass.startDate)} -{' '}
                    {formatTime(scClass.endDate)}
                  </span>
                </div>
                <div className='flex items-center'>
                  <LocationMarkerIcon className='h-5 w-5 text-gray-400 mr-2' />
                  <span>{scClass.type}</span>
                </div>
                <div className='flex items-center'>
                  <UserIcon className='h-5 w-5 text-gray-400 mr-2' />
                  <span>Instructor: {scClass.instructorId || 'TBD'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>Attendees</h2>
        </div>

        {isLoadingBookings ? (
          <div className='flex justify-center p-6'>
            <LoadingSpinner className='h-6 w-6 text-blue-600' />
          </div>
        ) : bookingsData?.success && bookings.length > 0 ? (
          <div className='divide-y divide-gray-200'>
            {bookings.map(booking => (
              <div key={booking.booking_id} className='px-6 py-4'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 font-medium'>
                      {booking.contact_first_name[0]}
                      {booking.contact_last_name[0]}
                    </span>
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {booking.contact_first_name} {booking.contact_last_name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {formatBookingState(booking.state)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='px-6 py-8 text-center'>
            <p className='text-gray-500'>No attendees yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
