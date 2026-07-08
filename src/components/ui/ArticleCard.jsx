import { Link } from 'react-router-dom';
import { Clock, Eye, MessageSquare, Bookmark } from 'lucide-react';
import { formatRelative } from '@utils/formatDate';
import { useAuth } from '@hooks/useAuth';

export default function ArticleCard({ article, featured = false }) {
  const { user } = useAuth();

  if (featured) {
    return (
      <article className="card group overflow-hidden">
        <Link to={`/article/${article.slug}`} className="block relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img src={article.coverImage || '/placeholder-article.jpg'} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={450} />
          </div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">{article.categories?.[0]}</span>
          </div>
        </Link>
        <div className="p-6">
          <Link to={`/article/${article.slug}`}>
            <h2 className="text-2xl font-bold text-vault-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-3 line-clamp-2">{article.title}</h2>
          </Link>
          <p className="text-vault-600 dark:text-vault-400 mb-4 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center justify-between text-sm text-vault-500 dark:text-vault-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readingTime} min</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{article.viewCount?.toLocaleString() || 0}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{article.commentCount || 0}</span>
            </div>
            <span>{formatRelative(article.publishedAt || article.createdAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card group flex flex-col sm:flex-row overflow-hidden">
      <Link to={`/article/${article.slug}`} className="sm:w-1/3 flex-shrink-0">
        <div className="aspect-[16/9] sm:aspect-square sm:h-full overflow-hidden">
          <img src={article.coverImage || '/placeholder-article.jpg'} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={300} />
        </div>
      </Link>
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {article.categories?.map((cat) => (
            <Link key={cat} to={`/category/${cat}`} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">{cat}</Link>
          ))}
        </div>
        <Link to={`/article/${article.slug}`}>
          <h3 className="text-lg font-bold text-vault-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">{article.title}</h3>
        </Link>
        <p className="text-sm text-vault-600 dark:text-vault-400 mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-vault-500 dark:text-vault-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime} min</span>
            <span>{formatRelative(article.publishedAt || article.createdAt)}</span>
          </div>
          {user?.bookmarks?.includes(article.id) && <Bookmark className="w-4 h-4 text-primary-500" aria-label="Bookmarked" />}
        </div>
      </div>
    </article>
  );
}
