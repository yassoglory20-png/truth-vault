import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import SEO from '@components/seo/SEO';
import ArticleCard from '@components/ui/ArticleCard';
import { useArticleSearch } from '@hooks/useArticles';
import { SITE_CONFIG } from '@config/site';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');
  const { results, loading, search } = useArticleSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { search(query); setSearchParams({ q: query }); }
  };

  const filteredResults = activeCategory === 'all' ? results : results.filter(a => a.categories?.includes(activeCategory));

  return (
    <>
      <SEO title="Search Articles" description="Search Truth Vault's archive of investigative journalism." url={`${SITE_CONFIG.url}/search`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-vault-900 dark:text-white mb-6">Search</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-400" /><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles, topics, investigations..." className="input pl-10" /></div>
            <button type="submit" className="btn-primary">Search</button>
          </div>
        </form>
        {results.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-vault-500 flex-shrink-0" />
            <button onClick={() => setActiveCategory('all')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${activeCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-vault-100 dark:bg-vault-800 text-vault-700 dark:text-vault-300'}`}>All</button>
            {SITE_CONFIG.categories.map((cat) => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-vault-100 dark:bg-vault-800 text-vault-700 dark:text-vault-300'}`}>{cat.name}</button>)}
          </div>
        )}
        {loading ? <LoadingSpinner /> : query && results.length === 0 ? <div className="text-center py-12"><p className="text-vault-500 mb-2">No results found for &quot;{query}&quot;</p><p className="text-sm text-vault-400">Try different keywords or browse categories.</p></div> : <div className="space-y-6">{filteredResults.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
        {!query && !loading && <div className="text-center py-12 text-vault-500"><p>Enter a search term to find articles.</p></div>}
      </div>
    </>
  );
}
