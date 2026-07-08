import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import SEO from '@components/seo/SEO';
import ArticleCard from '@components/ui/ArticleCard';
import { useArticles } from '@hooks/useArticles';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function Author() {
  const { authorId } = useParams();
  const { articles, loading } = useArticles({ status: 'published', limit: 20 });
  const authorArticles = articles.filter(a => a.authorId === authorId);
  const authorName = authorArticles[0]?.authorName || 'Unknown Author';

  return (
    <>
      <SEO title={`Articles by ${authorName}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-primary-600 dark:text-primary-400">{authorName[0] || 'A'}</div>
          <h1 className="text-2xl font-bold text-vault-900 dark:text-white mb-2">{authorName}</h1>
          <p className="text-vault-600 dark:text-vault-400 flex items-center justify-center gap-2"><FileText className="w-4 h-4" />{authorArticles.length} articles</p>
        </div>
        {loading ? <LoadingSpinner /> : authorArticles.length === 0 ? <div className="text-center py-12 text-vault-500"><p>No articles found from this author.</p></div> : <div className="space-y-6">{authorArticles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
      </div>
    </>
  );
}
