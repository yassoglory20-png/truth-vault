import { Heart } from 'lucide-react';
import { useLikes } from '@hooks/useLikes';

export default function LikeButton({ articleId, className = '' }) {
  const { liked, likeCount, loading, toggleLike } = useLikes(articleId);
  return (
    <button onClick={toggleLike} disabled={loading} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${className} ${liked ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-vault-100 dark:bg-vault-800 text-vault-600 dark:text-vault-400 hover:bg-vault-200 dark:hover:bg-vault-700'}`} aria-label={liked ? 'Unlike article' : 'Like article'} aria-pressed={liked}>
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} /><span className="text-sm font-medium">{likeCount.toLocaleString()}</span>
    </button>
  );
}
