import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import { formatDate } from '@utils/formatDate';

export default function FeaturedArticle({ article }) {
  if (!article) return null;
  return (
    <section className="relative overflow-hidden rounded-2xl bg-vault-900 dark:bg-vault-950 text-white">
      <div className="absolute inset-0">
        <img src={article.coverImage} alt="" className="w-full h-full object-cover opacity-40" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-vault-950 via-vault-900/80 to-transparent" />
      </div>
      <div className="relative p-8 md:p-12 lg:p-16 max-w-4xl">
        <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-xs font-medium mb-4">Featured Investigation</span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          <Link to={`/article/${article.slug}`} className="hover:underline">{article.title}</Link>
        </h1>
        <p className="text-lg text-vault-200 mb-6 max-w-2xl line-clamp-3">{article.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-vault-300 mb-6">
          <span>By {article.authorName}</span><span>&bull;</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readingTime} min read</span><span>&bull;</span>
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{article.viewCount?.toLocaleString()} views</span><span>&bull;</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <Link to={`/article/${article.slug}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-vault-900 font-medium hover:bg-vault-100 transition-colors">
          Read Full Story<ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
