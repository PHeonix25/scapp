import Link from 'next/link';
import { ReactNode } from 'react';

type CircusCardProps = { children?: ReactNode; link?: string };

export function CircusCard({ children, link }: CircusCardProps) {
  const cardContent = (
    <div className='max-w-7xl mx-auto'>
      <div className='relative group'>
        <div className='absolute -inset-1 bg-linear-to-tr from-pink-300 to-blue-300 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
        <div className='relative px-7 py-6 bg-card ring-1 ring-border rounded-lg space-x-6'>
          <div className='space-y-2'>{children}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='relative'>
      {link ? <Link href={link}>{cardContent}</Link> : cardContent}
    </div>
  );
}
