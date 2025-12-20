import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`bg-white shadow rounded-lg p-8 text-center ${className}`}>
      <div className='text-muted-foreground mb-4'>{title}</div>
      {description && (
        <div className='text-sm text-muted-foreground mb-4'>{description}</div>
      )}
      {action && (
        <Link
          href={action.href}
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
