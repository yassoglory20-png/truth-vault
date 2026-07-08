import { Link } from 'react-router-dom';
import { TrendingUp, Tag, Clock } from 'lucide-react';
import { useTrendingArticles } from '@hooks/useArticles';
import { SITE_CONFIG } from '@config/site';

export default function Sidebar() {
  const { articles: trending, loading } = useTrendingArticles(5);

  return (
    <aside className="space-y-8">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-bold text-vault-900 dark:text-white">Trending</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-vault-200 dark:bg-vault-700 rounded animate-pulse" />)}
          </div>
        ) : (
          <ul className="space-y-4">
            {trending.map((article, index) => (
              <li key={article.id}>
                <Link to={`/article/${article.slug}`} className="group flex gap-3 items-start">
                  <span className="text-2xl font-bold text-vault-300 dark:text-vault-600 group-hover:text-primary-500 transition-colors">{index + 1}</span>
                  <div>
                    <h3 className="text-sm font-medium text-vault-800 dark:text-vault-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">{article.title}</h3>
                    <span className="text-xs text-vault-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{article.readingTime} min read</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-bold text-vault-900 dark:text-white">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {SITE_CONFIG.categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="px-3 py-1 rounded-full text-sm bg-vault-100 dark:bg-vault-700 text-vault-700 dark:text-vault-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">{cat.name}</Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
