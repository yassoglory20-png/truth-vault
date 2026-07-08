import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const popularTags = [
  'corruption', 'whistleblower', 'data-privacy', 'climate-crisis',
  'human-rights', 'financial-fraud', 'government', 'healthcare',
  'big-tech', 'social-justice', 'transparency', 'accountability',
  'surveillance', 'lobbying', 'offshore', 'misinformation'
];

export default function TagCloud() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 className="text-lg font-bold text-vault-900 dark:text-white">Popular Tags</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag) => (
          <Link key={tag} to={`/tag/${tag}`} className="px-3 py-1.5 rounded-full text-sm bg-vault-100 dark:bg-vault-700 text-vault-700 dark:text-vault-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">#{tag}</Link>
        ))}
      </div>
    </div>
  );
}
