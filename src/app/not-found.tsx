import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
        <h2 className='text-3xl font-semibold text-gray-800 mb-4'>
          Page not found
        </h2>
        <p className='text-gray-600 mb-8'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href='/'
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
