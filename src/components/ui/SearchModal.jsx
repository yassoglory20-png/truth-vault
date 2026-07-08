import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useArticleSearch } from '@hooks/useArticles';
import { trackSearch } from '@services/analytics';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef(null);
  const { results, loading, search } = useArticleSearch();

  useEffect(() => { if (isOpen) { inputRef.current?.focus(); setQuery(''); } }, [isOpen]);
  useEffect(() => {
    const timeout = setTimeout(() => { if (query.length >= 2) { search(query); trackSearch(query, results.length); } }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (article) => {
    const updated = [article.title, ...recentSearches.filter(s => s !== article.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    onClose();
  };

  const clearRecent = () => { setRecentSearches([]); localStorage.removeItem('recentSearches'); };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Search articles">
      <div className="bg-white dark:bg-vault-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-vault-200 dark:border-vault-700">
          <Search className="w-5 h-5 text-vault-400" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles, topics, or tags..." className="flex-1 bg-transparent outline-none text-vault-900 dark:text-white placeholder-vault-400 text-lg" aria-label="Search query" />
          <button onClick={onClose} className="p-1 rounded hover:bg-vault-100 dark:hover:bg-vault-700" aria-label="Close search"><X className="w-5 h-5 text-vault-500" /></button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {query.length < 2 ? (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-vault-500 dark:text-vault-400">Recent Searches</h3>
                    <button onClick={clearRecent} className="text-xs text-primary-600 hover:underline">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button key={i} onClick={() => setQuery(term)} className="flex items-center gap-1 px-3 py-1 rounded-full bg-vault-100 dark:bg-vault-700 text-sm text-vault-700 dark:text-vault-300 hover:bg-vault-200 dark:hover:bg-vault-600"><Clock className="w-3 h-3" />{term}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-center py-8 text-vault-400"><p>Start typing to search articles...</p></div>
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-vault-400"><div className="animate-pulse">Searching...</div></div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-vault-500"><p>No results found for &quot;{query}&quot;</p></div>
          ) : (
            <ul className="divide-y divide-vault-100 dark:divide-vault-700">
              {results.map((article) => (
                <li key={article.id}>
                  <Link to={`/article/${article.slug}`} onClick={() => handleSelect(article)} className="flex items-center gap-4 p-4 hover:bg-vault-50 dark:hover:bg-vault-700/50 transition-colors group">
                    {article.coverImage && <img src={article.coverImage} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" loading="lazy" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-vault-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">{article.title}</h4>
                      <p className="text-xs text-vault-500 dark:text-vault-400 mt-1 line-clamp-1">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-vault-400"><span>{article.categories?.[0]}</span><span>&bull;</span><span>{article.readingTime} min read</span></div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-vault-400 group-hover:text-primary-600 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
