import { Link } from 'react-router-dom';
import { useRelatedArticles } from '@hooks/useArticles';
import { ArrowRight, Clock } from 'lucide-react';

export default function RelatedArticles({ articleId, categories, tags }) {
  const { articles, loading } = useRelatedArticles(articleId, categories || [], tags || []);
  if (loading || articles.length === 0) return null;
  return (
    <section className="mt-12 pt-8 border-t border-vault-200 dark:border-vault-700">
      <h2 className="text-2xl font-bold text-vault-900 dark:text-white mb-6">Related Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="card group overflow-hidden">
            <Link to={`/article/${article.slug}`} className="block">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={article.coverImage || '/placeholder-article.jpg'} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={225} />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-vault-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">{article.title}</h3>
                <div className="flex items-center gap-2 text-xs text-vault-500 dark:text-vault-400">
                  <Clock className="w-3 h-3" /><span>{article.readingTime} min read</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
