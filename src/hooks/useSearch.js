import { useState, useEffect, useCallback } from 'react';
import { useArticleSearch } from './useArticles';

export function useSearch() {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useArticleSearch();

  const debouncedSearch = useCallback((term) => {
    const timeoutId = setTimeout(() => { search(term); }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (query.length >= 2) {
      const cleanup = debouncedSearch(query);
      return cleanup;
    }
  }, [query, debouncedSearch]);

  return { query, setQuery, results, loading, error };
}
