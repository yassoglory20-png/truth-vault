import { useParams } from 'react-router-dom';
import { Tag } from 'lucide-react';
import SEO from '@components/seo/SEO';
import ArticleCard from '@components/ui/ArticleCard';
import { useArticles } from '@hooks/useArticles';
import { SITE_CONFIG } from '@config/site';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function TagPage() {
  const { tag } = useParams();
  const { articles, loading, hasMore, loadMore } = useArticles({ status: 'published', tag, limit: 12 });

  return (
    <>
      <SEO title={`Articles tagged #${tag}`} description={`Browse all articles tagged with #${tag} on Truth Vault.`} url={`${SITE_CONFIG.url}/tag/${tag}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vault-900 dark:text-white flex items-center gap-3"><Tag className="w-8 h-8 text-primary-600 dark:text-primary-400" />#{tag}</h1>
          <p className="text-vault-600 dark:text-vault-400 mt-2">Browse all articles tagged with #{tag}</p>
        </div>
        {loading && articles.length === 0 ? <LoadingSpinner /> : articles.length === 0 ? <div className="text-center py-12 text-vault-500"><p>No articles found with this tag.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
        {hasMore && <div className="mt-8 text-center"><button onClick={loadMore} disabled={loading} className="btn-secondary">{loading ? 'Loading...' : 'Load More'}</button></div>}
      </div>
    </>
  );
}
