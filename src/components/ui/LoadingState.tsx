interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  className = '',
}: LoadingStateProps) {
  return (
    <div className={`container mx-auto p-6 ${className}`}>
      <div className='flex items-center justify-center h-64'>
        <div className='flex items-center space-x-2'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600' />
          <div className='text-lg text-muted-foreground'>{message}</div>
        </div>
      </div>
    </div>
  );
}
