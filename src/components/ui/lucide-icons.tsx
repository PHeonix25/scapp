import {
  Search,
  X,
  ChevronLeft,
  Plus,
  Loader2,
  ArrowUpDown,
  Search as SearchSolid,
  Sun,
  Moon,
  Calendar,
  Clock,
  MapPin,
  User,
  Menu,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  className?: string;
}

// Re-export all Lucide icons we're using
export {
  Search,
  X,
  ChevronLeft,
  Plus,
  Loader2,
  ArrowUpDown,
  SearchSolid,
  Sun,
  Moon,
  Calendar,
  Clock,
  MapPin,
  User,
  Menu,
  type LucideIcon,
  type IconProps,
};

// Custom components that need special handling
export const LoadingSpinner = ({
  className = 'h-8 w-8',
  ...props
}: IconProps) => <Loader2 className={`animate-spin ${className}`} {...props} />;

export const LoadingSpinnerCircle = ({
  className = 'h-4 w-4 text-white',
  ...props
}: IconProps) => <Loader2 className={`animate-spin ${className}`} {...props} />;

export const ErrorIcon = ({
  className = 'h-5 w-5 text-destructive',
  ...props
}: IconProps) => <X className={className} {...props} />;

export const BackArrowIcon = ({
  className = 'h-4 w-4',
  ...props
}: IconProps) => <ChevronLeft className={className} {...props} />;

export const SortUpDownIcon = ({
  className = 'h-4 w-4',
  ...props
}: IconProps) => <ArrowUpDown className={className} {...props} />;

export const SearchIconSolid = ({
  className = 'h-5 w-5 text-gray-400',
  ...props
}: IconProps) => <SearchSolid className={className} {...props} />;

export const LocationMarkerIcon = ({
  className = 'h-5 w-5',
  ...props
}: IconProps) => <MapPin className={className} {...props} />;

export const XIcon = ({ className = 'h-6 w-6', ...props }: IconProps) => (
  <X className={className} {...props} />
);

// Export all icons from lucide-react for future use
export * from 'lucide-react';
