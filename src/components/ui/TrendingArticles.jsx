import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useTrendingArticles } from '@hooks/useArticles';

export default function TrendingArticles() {
  const { articles, loading } = useTrendingArticles(5);
  if (loading) return null;
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl font-bold text-vault-900 dark:text-white">Trending Now</h2>
        </div>
        <Link to="/search?sort=trending" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {articles.map((article, index) => (
          <article key={article.id} className="card group p-4">
            <span className="text-3xl font-bold text-vault-200 dark:text-vault-700 mb-2 block">{String(index + 1).padStart(2, '0')}</span>
            <Link to={`/article/${article.slug}`}>
              <h3 className="text-sm font-bold text-vault-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-3 mb-2">{article.title}</h3>
            </Link>
            <p className="text-xs text-vault-500 dark:text-vault-400 line-clamp-2">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
