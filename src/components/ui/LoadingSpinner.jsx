import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vault-50 dark:bg-vault-950">
        <Loader2 className={`${sizes[size]} text-primary-600 animate-spin ${className}`} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizes[size]} text-primary-600 animate-spin ${className}`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
