interface CircusPlaceholderProps {
  text: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
}

export function CircusPlaceholder({
  text,
  width = 'md',
  variant = 'gray',
}: CircusPlaceholderProps) {
  // Use predefined size classes that Tailwind can detect
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    gray: 'bg-muted text-muted-foreground',
    blue: 'bg-blue-50 text-blue-400',
    green: 'bg-green-50 text-green-400',
    yellow: 'bg-yellow-50 text-yellow-400',
    red: 'bg-red-50 text-red-400',
  };

  return (
    <div
      className={`${sizeClasses[width]} ${colorClasses[variant]} rounded-lg flex flex-col items-center justify-center`}
    >
      <svg
        className={`${iconSizeClasses[width]} mb-2`}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      </svg>
      <p className='text-xs text-center px-2'>{text || 'Image'}</p>
    </div>
  );
}
