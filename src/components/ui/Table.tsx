import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  onClick?: () => void;
}

interface TableHeadCellProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  sortable?: boolean;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className='bg-primary-background shadow overflow-hidden sm:rounded-lg w-full'>
      <div className='overflow-x-auto w-full'>
        <table className={`w-full divide-y divide-gray-200 ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-primary-background ${className}`}>{children}</thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className='bg-primary-background divide-y divide-gray-200'>
      {children}
    </tbody>
  );
}

export function TableRow({ children, onClick, className = '' }: TableRowProps) {
  return (
    <tr
      className={`block sm:table-row hover:bg-primary-background align-top border-b border-border last:border-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = '',
  colSpan,
  onClick,
}: TableCellProps) {
  return (
    <td
      className={`sm:table-cell block px-4 py-3 sm:py-4 text-sm text-foreground wrap-break-word ${onClick ? 'cursor-pointer' : ''} ${className}`}
      colSpan={colSpan}
      onClick={onClick}
    >
      {children}
    </td>
  );
}

export function TableHeadCell({
  children,
  className = '',
  onClick,
  sortable,
}: TableHeadCellProps) {
  const baseClasses =
    'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words';
  const interactiveClasses = sortable ? 'cursor-pointer hover:bg-gray-100' : '';

  return (
    <th
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}
