import { ReactNode } from 'react';

type CircusHighlightProps = { children?: ReactNode };

export function CircusHighlight({ children }: CircusHighlightProps) {
  return (
    <span className='rounded-xl outline-2 outline-dashed outline-purple-300 bg-secondary'>
      {children}
    </span>
  );
}
