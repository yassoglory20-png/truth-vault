import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import SEO from '@components/seo/SEO';
import ArticleTable from '@components/admin/ArticleTable';
import { getAllArticles } from '@services/articles';
import { useToast } from '@hooks/useToast';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchArticles = async () => {
    try { setLoading(true); const data = await getAllArticles(100); setArticles(data); }
    catch (err) { toast.error('Failed to load articles'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArticles(); }, []);

  const filteredArticles = articles.filter(article => {
    const matchesFilter = filter === 'all' || article.status === filter;
    const matchesSearch = !searchQuery || article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <SEO title="Manage Articles" noindex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-vault-900 dark:text-white">Articles</h1>
          <Link to="/admin/editor" className="btn-primary inline-flex items-center gap-2 self-start"><Plus className="w-4 h-4" />New Article</Link>
        </div>
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-400" /><input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" /></div>
            <div className="flex gap-2">
              {['all', 'published', 'draft', 'archived'].map((status) => <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === status ? 'bg-primary-600 text-white' : 'bg-vault-100 dark:bg-vault-800 text-vault-700 dark:text-vault-300 hover:bg-vault-200 dark:hover:bg-vault-700'}`}>{status}</button>)}
            </div>
          </div>
        </div>
        {loading ? <LoadingSpinner /> : <div className="card overflow-hidden"><div className="p-4 border-b border-vault-200 dark:border-vault-700 flex items-center justify-between"><h2 className="font-semibold text-vault-900 dark:text-white">{filteredArticles.length} articles</h2><Filter className="w-4 h-4 text-vault-400" /></div><ArticleTable articles={filteredArticles} onRefresh={fetchArticles} /></div>}
      </div>
    </>
  );
}
