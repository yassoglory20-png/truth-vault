import { useParams, Link } from 'react-router-dom';
import { Folder, ArrowRight } from 'lucide-react';
import SEO from '@components/seo/SEO';
import ArticleCard from '@components/ui/ArticleCard';
import Sidebar from '@components/layout/Sidebar';
import { useArticles } from '@hooks/useArticles';
import { SITE_CONFIG } from '@config/site';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function Category() {
  const { category } = useParams();
  const categoryInfo = SITE_CONFIG.categories.find(c => c.id === category);
  const { articles, loading, hasMore, loadMore } = useArticles({ status: 'published', category, limit: 12 });
  const categoryName = categoryInfo?.name || category;
  const categoryDescription = categoryInfo?.description || `Articles in ${category}`;

  return (
    <>
      <SEO title={`${categoryName} Articles`} description={categoryDescription} url={`${SITE_CONFIG.url}/category/${category}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-vault-500 dark:text-vault-400 mb-2">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link><ArrowRight className="w-4 h-4" />
            <Link to="/categories" className="hover:text-primary-600 dark:hover:text-primary-400">Categories</Link><ArrowRight className="w-4 h-4" />
            <span className="text-vault-900 dark:text-white">{categoryName}</span>
          </div>
          <h1 className="text-3xl font-bold text-vault-900 dark:text-white flex items-center gap-3"><Folder className="w-8 h-8 text-primary-600 dark:text-primary-400" />{categoryName}</h1>
          <p className="text-vault-600 dark:text-vault-400 mt-2">{categoryDescription}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading && articles.length === 0 ? <LoadingSpinner /> : articles.length === 0 ? <div className="text-center py-12 text-vault-500"><p>No articles found in this category yet.</p></div> : <div className="space-y-6">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
            {hasMore && <div className="mt-8 text-center"><button onClick={loadMore} disabled={loading} className="btn-secondary">{loading ? 'Loading...' : 'Load More'}</button></div>}
          </div>
          <div className="hidden lg:block"><Sidebar /></div>
        </div>
      </div>
    </>
  );
}
