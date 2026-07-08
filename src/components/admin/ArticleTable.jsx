import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Star, TrendingUp } from 'lucide-react';
import { formatDate } from '@utils/formatDate';
import { deleteArticle, toggleFeatured, toggleTrending } from '@services/articles';
import { useToast } from '@hooks/useToast';

export default function ArticleTable({ articles, onRefresh }) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    setDeleting(id);
    try { await deleteArticle(id); toast.success('Article deleted'); onRefresh(); }
    catch (err) { toast.error('Failed to delete article'); }
    finally { setDeleting(null); }
  };

  const handleToggleFeatured = async (id, current) => {
    try { await toggleFeatured(id, !current); toast.success(current ? 'Removed from featured' : 'Added to featured'); onRefresh(); }
    catch (err) { toast.error('Failed to update'); }
  };

  const handleToggleTrending = async (id, current) => {
    try { await toggleTrending(id, !current); toast.success(current ? 'Removed from trending' : 'Added to trending'); onRefresh(); }
    catch (err) { toast.error('Failed to update'); }
  };

  const statusColors = {
    published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    archived: 'bg-vault-100 text-vault-700 dark:bg-vault-800 dark:text-vault-400',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-vault-500 dark:text-vault-400 uppercase bg-vault-50 dark:bg-vault-900/50">
          <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Views</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-vault-200 dark:divide-vault-700">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-vault-50 dark:hover:bg-vault-800/50">
              <td className="px-4 py-3">
                <div className="font-medium text-vault-900 dark:text-white max-w-xs truncate">{article.title}</div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => handleToggleFeatured(article.id, article.featured)} className={`p-1 rounded ${article.featured ? 'text-yellow-500' : 'text-vault-400 hover:text-yellow-500'}`} title="Toggle featured"><Star className={`w-4 h-4 ${article.featured ? 'fill-current' : ''}`} /></button>
                  <button onClick={() => handleToggleTrending(article.id, article.trending)} className={`p-1 rounded ${article.trending ? 'text-red-500' : 'text-vault-400 hover:text-red-500'}`} title="Toggle trending"><TrendingUp className="w-4 h-4" /></button>
                </div>
              </td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[article.status] || statusColors.draft}`}>{article.status}</span></td>
              <td className="px-4 py-3 text-vault-600 dark:text-vault-400">{article.viewCount?.toLocaleString() || 0}</td>
              <td className="px-4 py-3 text-vault-600 dark:text-vault-400">{formatDate(article.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link to={`/article/${article.slug}`} target="_blank" className="p-1 rounded hover:bg-vault-200 dark:hover:bg-vault-700 text-vault-600 dark:text-vault-400" title="View"><Eye className="w-4 h-4" /></Link>
                  <Link to={`/admin/editor/${article.id}`} className="p-1 rounded hover:bg-vault-200 dark:hover:bg-vault-700 text-vault-600 dark:text-vault-400" title="Edit"><Edit className="w-4 h-4" /></Link>
                  <button onClick={() => handleDelete(article.id)} disabled={deleting === article.id} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 disabled:opacity-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
