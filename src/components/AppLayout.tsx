'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  X as ErrorIcon,
  Menu as MenuIcon,
  X as XIcon,
} from '@/components/ui/lucide-icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function NavigationErrorFallback() {
  return (
    <div className='bg-destructive/10 p-4 rounded-md border border-destructive/20'>
      <div className='flex'>
        <ErrorIcon className='h-5 w-5 text-destructive' />
        <p className='ml-3 text-sm text-destructive'>
          Navigation failed to load. Please try refreshing the page.
        </p>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Skills', href: '/skills' },
    { name: 'Class Plans', href: '/class-plans' },
    { name: 'Classes', href: '/classes' },
    { name: 'Members', href: '/members' },
  ];

  return (
    <div className='min-h-screen bg-background'>
      <div className='bg-card shadow-sm border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <div className='shrink-0'>
                <Link href='/' className='text-xl font-bold text-foreground'>
                  Social Circus
                </Link>
              </div>
              <ErrorBoundary fallback={<NavigationErrorFallback />}>
                <nav className='hidden sm:ml-6 sm:flex sm:space-x-4'>
                  {navigation.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </ErrorBoundary>
            </div>
            <div className='flex items-center'>
              <ThemeToggle />
              <button
                type='button'
                className='sm:hidden ml-4 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
              >
                <span className='sr-only'>
                  {mobileMenuOpen ? 'Close menu' : 'Open menu'}
                </span>
                {mobileMenuOpen ? (
                  <XIcon className='block h-6 w-6' aria-hidden='true' />
                ) : (
                  <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className='pt-2 pb-3 space-y-1'>
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground border-l-4 border-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  'block pl-3 pr-4 py-2 text-base font-medium transition-colors'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className='py-10'>
        <main>
          <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
