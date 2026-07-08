import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Eye, FileText } from 'lucide-react';
import SEO from '@components/seo/SEO';
import JsonLd from '@components/seo/JsonLd';
import ArticleCard from '@components/ui/ArticleCard';
import FeaturedArticle from '@components/ui/FeaturedArticle';
import TrendingArticles from '@components/ui/TrendingArticles';
import Sidebar from '@components/layout/Sidebar';
import { useArticles, useFeaturedArticles } from '@hooks/useArticles';
import { SITE_CONFIG } from '@config/site';
import { generateBreadcrumbSchema } from '@utils/seo';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function Home() {
  const { articles, loading, hasMore, loadMore } = useArticles({ status: 'published', limit: 6 });
  const { articles: featured } = useFeaturedArticles(1);
  const featuredArticle = featured[0];
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', url: SITE_CONFIG.url }]);

  return (
    <>
      <SEO title="Independent Investigative Journalism" description={SITE_CONFIG.description} image={`${SITE_CONFIG.url}/og-image.jpg`} url={SITE_CONFIG.url} />
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-vault-900 dark:text-white">Truth<span className="text-primary-600 dark:text-primary-400">Vault</span></h1>
          </div>
          <p className="text-xl text-vault-600 dark:text-vault-400 max-w-2xl mx-auto mb-8">Uncovering facts, exposing corruption, and amplifying voices that matter through rigorous investigative journalism.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/categories" className="btn-primary inline-flex items-center gap-2">Explore Stories <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/about" className="btn-secondary inline-flex items-center gap-2">About Us <Eye className="w-4 h-4" /></Link>
          </div>
        </section>
        {featuredArticle && <section className="mb-12"><FeaturedArticle article={featuredArticle} /></section>}
        <TrendingArticles />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-vault-900 dark:text-white flex items-center gap-2"><FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />Latest Investigations</h2>
              <Link to="/search" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
            </div>
            {loading && articles.length === 0 ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => <div key={i} className="card h-48 animate-pulse bg-vault-200 dark:bg-vault-800" />)}
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
            )}
            {hasMore && <div className="mt-8 text-center"><button onClick={loadMore} disabled={loading} className="btn-secondary">{loading ? 'Loading...' : 'Load More Articles'}</button></div>}
          </div>
          <div className="hidden lg:block"><Sidebar /></div>
        </div>
      </div>
    </>
  );
}
