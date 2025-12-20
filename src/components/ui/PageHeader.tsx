import type { ReactNode } from 'react';

import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  action?: {
    href: string;
    label: string;
    variant?: 'primary' | 'secondary';
  };
  children?: ReactNode;
}

export function PageHeader({ title, action, children }: PageHeaderProps) {
  const buttonClasses =
    action?.variant === 'secondary'
      ? 'px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors'
      : 'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors';

  return (
    <div className='flex justify-between items-center mb-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
        {children}
      </div>
      {action && (
        <Link href={action.href} className={buttonClasses}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
