interface ErrorStateProps {
  message: string;
  className?: string;
  debugInfo?: string;
}

export function ErrorState({
  message,
  className = '',
  debugInfo,
}: ErrorStateProps) {
  return (
    <div className={`container mx-auto p-6 ${className}`}>
      <div className='bg-destructive/10 border border-destructive/20 rounded-md p-4'>
        <div className='text-destructive'>{message}</div>
        {debugInfo && (
          <div className='text-error-debug'>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
