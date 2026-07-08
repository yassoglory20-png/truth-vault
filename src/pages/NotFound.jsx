import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import SEO from '@components/seo/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" noindex={true} />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-vault-200 dark:text-vault-800 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-vault-900 dark:text-white mb-2">Page Not Found</h2>
          <p className="text-vault-600 dark:text-vault-400 mb-6">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary inline-flex items-center gap-2"><Home className="w-4 h-4" />Back to Home</Link>
            <Link to="/search" className="btn-secondary inline-flex items-center gap-2"><Search className="w-4 h-4" />Search</Link>
          </div>
        </div>
      </div>
    </>
  );
}
