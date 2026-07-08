import { useState, useEffect, useCallback } from 'react';
import {
  getArticles, getArticleBySlug, getArticleById,
  getFeaturedArticles, getTrendingArticles, getRelatedArticles,
  searchArticles, incrementViewCount,
} from '@services/articles';

export function useArticles(options = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true); setError(null);
      const result = await getArticles({ ...options, ...overrideOptions });
      setArticles(result.articles);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [options]);

  const loadMore = useCallback(async () => {
    if (!hasMore || !lastDoc) return;
    try {
      const result = await getArticles({ ...options, startAfter: lastDoc });
      setArticles(prev => [...prev, ...result.articles]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) { setError(err.message); }
  }, [options, hasMore, lastDoc]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);
  return { articles, loading, error, hasMore, loadMore, refetch: fetchArticles };
}

export function useArticle(slug) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getArticleBySlug(slug);
        if (data) { setArticle(data); await incrementViewCount(data.id); }
        else setError('Article not found');
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
    if (slug) load();
  }, [slug]);

  return { article, loading, error };
}

export function useFeaturedArticles(limit = 5) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFeaturedArticles(limit).then(result => { setArticles(result.articles); setLoading(false); });
  }, [limit]);
  return { articles, loading };
}

export function useTrendingArticles(limit = 5) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTrendingArticles(limit).then(result => { setArticles(result.articles); setLoading(false); });
  }, [limit]);
  return { articles, loading };
}

export function useRelatedArticles(articleId, categories, tags) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!articleId || !categories?.length) { setLoading(false); return; }
    getRelatedArticles(articleId, categories, tags || []).then(result => { setArticles(result); setLoading(false); });
  }, [articleId, categories, tags]);
  return { articles, loading };
}

export function useArticleSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (term) => {
    if (!term || term.length < 2) { setResults([]); return; }
    try {
      setLoading(true); setError(null);
      const data = await searchArticles(term);
      setResults(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  return { results, loading, error, search };
}
