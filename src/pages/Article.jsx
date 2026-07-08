import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import SEO from '@components/seo/SEO';
import JsonLd from '@components/seo/JsonLd';
import ReadingProgress from '@components/ui/ReadingProgress';
import TableOfContents from '@components/ui/TableOfContents';
import LikeButton from '@components/ui/LikeButton';
import BookmarkButton from '@components/ui/BookmarkButton';
import ShareButtons from '@components/ui/ShareButtons';
import CommentSection from '@components/ui/CommentSection';
import RelatedArticles from '@components/ui/RelatedArticles';
import { useArticle } from '@hooks/useArticles';
import { formatDate } from '@utils/formatDate';
import { sanitizeHtml } from '@utils/security';
import { generateArticleSchema, generateBreadcrumbSchema } from '@utils/seo';
import { SITE_CONFIG } from '@config/site';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function Article() {
  const { slug } = useParams();
  const { article, loading, error } = useArticle(slug);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vault-900 dark:text-white mb-2">Article Not Found</h1>
          <p className="text-vault-600 dark:text-vault-400 mb-4">The article you are looking for does not exist.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Articles', url: `${SITE_CONFIG.url}/search` },
    { name: article.title, url: `${SITE_CONFIG.url}/article/${article.slug}` },
  ]);
  const cleanContent = sanitizeHtml(article.content);

  return (
    <>
      <SEO title={article.metaTitle || article.title} description={article.metaDescription || article.excerpt} image={article.coverImage} url={`${SITE_CONFIG.url}/article/${article.slug}`} type="article" publishedAt={article.publishedAt} modifiedAt={article.updatedAt} author={article.authorName} tags={article.tags} />
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ReadingProgress />
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-vault-600 dark:text-vault-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"><ArrowLeft className="w-4 h-4" />Back to Home</Link>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories?.map((cat) => (
                  <Link key={cat} to={`/category/${cat}`} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/30 transition-colors">{cat}</Link>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vault-900 dark:text-white mb-6 leading-tight">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-vault-500 dark:text-vault-400 mb-6">
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{article.authorName}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(article.publishedAt || article.createdAt)}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readingTime} min read</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{article.viewCount?.toLocaleString()} views</span>
              </div>
              {article.coverImage && <figure className="mb-8"><img src={article.coverImage} alt={article.title} className="w-full h-auto rounded-xl shadow-lg" loading="eager" width={1200} height={630} /></figure>}
            </header>
            <div className="article-content mb-8" dangerouslySetInnerHTML={{ __html: cleanContent }} />
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => <Link key={tag} to={`/tag/${tag}`} className="px-3 py-1 rounded-full text-sm bg-vault-100 dark:bg-vault-800 text-vault-700 dark:text-vault-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">#{tag}</Link>)}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-vault-50 dark:bg-vault-800/50 rounded-xl mb-8">
              <div className="flex items-center gap-3"><LikeButton articleId={article.id} /><BookmarkButton articleId={article.id} /></div>
              <ShareButtons article={article} />
            </div>
            <div className="card p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl font-bold text-primary-600 dark:text-primary-400">{article.authorName?.[0] || 'A'}</div>
                <div><h3 className="font-bold text-vault-900 dark:text-white">{article.authorName}</h3><p className="text-sm text-vault-500 dark:text-vault-400">Investigative Journalist</p></div>
              </div>
            </div>
            <CommentSection articleId={article.id} />
            <RelatedArticles articleId={article.id} categories={article.categories} tags={article.tags} />
          </div>
          <aside className="hidden lg:block"><TableOfContents /></aside>
        </div>
      </article>
    </>
  );
}
