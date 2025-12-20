import Link from 'next/link';

interface CircusLinkButtonProps {
  link: string;
  text: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function CircusLinkButton({
  link,
  text,
  size = 'md',
  fullWidth = false,
  className = '',
}: CircusLinkButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <Link
      href={link}
      className={`inline-flex flex-1 rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow text-foreground ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <div
        className={`bg-card rounded-xl text-center flex-1 flex items-center justify-center ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
      >
        {text}
      </div>
    </Link>
  );
}
