import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function AuthorCard({ author }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400">{author.displayName?.[0] || 'A'}</div>
        <div>
          <h3 className="text-lg font-bold text-vault-900 dark:text-white">{author.displayName}</h3>
          <p className="text-sm text-vault-500 dark:text-vault-400 capitalize">{author.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-vault-600 dark:text-vault-400 mb-4">
        <span className="flex items-center gap-1"><FileText className="w-4 h-4" />{author.articleCount || 0} articles</span>
      </div>
      <Link to={`/author/${author.uid}`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">View all articles</Link>
    </div>
  );
}
