import { Bookmark } from 'lucide-react';
import { useArticleBookmark } from '@hooks/useBookmarks';

export default function BookmarkButton({ articleId, className = '' }) {
  const { bookmarked, loading, toggleBookmark } = useArticleBookmark(articleId);
  return (
    <button onClick={toggleBookmark} disabled={loading} className={`p-2 rounded-full transition-colors ${className} ${bookmarked ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-vault-100 dark:bg-vault-800 text-vault-600 dark:text-vault-400 hover:bg-vault-200 dark:hover:bg-vault-700'}`} aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'} aria-pressed={bookmarked}>
      <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
    </button>
  );
}
