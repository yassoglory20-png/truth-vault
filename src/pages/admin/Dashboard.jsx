import { Link } from 'react-router-dom';
import { FileText, Users, MessageSquare, Eye, Plus, Settings, BarChart3 } from 'lucide-react';
import SEO from '@components/seo/SEO';
import StatsCard from '@components/admin/StatsCard';
import { useAnalytics } from '@hooks/useAnalytics';
import { formatDate } from '@utils/formatDate';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const stats = useAnalytics();
  if (stats.loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <SEO title="Admin Dashboard" noindex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-vault-900 dark:text-white">Dashboard</h1>
          <Link to="/admin/editor" className="btn-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" />New Article</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Articles" value={stats.totalArticles.toLocaleString()} icon={FileText} />
          <StatsCard title="Total Views" value={stats.totalViews.toLocaleString()} icon={Eye} />
          <StatsCard title="Comments" value={stats.totalComments.toLocaleString()} icon={MessageSquare} />
          <StatsCard title="Subscribers" value={stats.totalSubscribers.toLocaleString()} icon={Users} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-vault-900 dark:text-white">Recent Articles</h2><Link to="/admin/articles" className="text-sm text-primary-600 hover:underline">View All</Link></div>
            <div className="space-y-4">
              {stats.recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 rounded-lg bg-vault-50 dark:bg-vault-800/50">
                  <div className="min-w-0 flex-1"><Link to={`/admin/editor/${article.id}`} className="text-sm font-medium text-vault-900 dark:text-white hover:text-primary-600 truncate block">{article.title}</Link><span className="text-xs text-vault-500">{formatDate(article.createdAt)}</span></div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{article.status}</span>
                </div>
              ))}
              {stats.recentArticles.length === 0 && <p className="text-sm text-vault-500 text-center py-4">No articles yet</p>}
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-vault-900 dark:text-white">Top Performing</h2><Link to="/admin/analytics" className="text-sm text-primary-600 hover:underline">Analytics</Link></div>
            <div className="space-y-4">
              {stats.topArticles.map((article, index) => (
                <div key={article.id} className="flex items-center gap-3 p-3 rounded-lg bg-vault-50 dark:bg-vault-800/50">
                  <span className="text-lg font-bold text-vault-300 dark:text-vault-600 w-6">{index + 1}</span>
                  <div className="min-w-0 flex-1"><Link to={`/article/${article.slug}`} target="_blank" className="text-sm font-medium text-vault-900 dark:text-white hover:text-primary-600 truncate block">{article.title}</Link><span className="text-xs text-vault-500">{article.viewCount?.toLocaleString()} views</span></div>
                </div>
              ))}
              {stats.topArticles.length === 0 && <p className="text-sm text-vault-500 text-center py-4">No data yet</p>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Link to="/admin/articles" className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow"><div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20"><FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" /></div><div><h3 className="font-bold text-vault-900 dark:text-white">Manage Articles</h3><p className="text-sm text-vault-500">Edit, publish, or delete</p></div></Link>
          <Link to="/admin/analytics" className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow"><div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20"><BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" /></div><div><h3 className="font-bold text-vault-900 dark:text-white">Analytics</h3><p className="text-sm text-vault-500">View detailed stats</p></div></Link>
          <div className="card p-6 flex items-center gap-4 opacity-50 cursor-not-allowed"><div className="p-3 rounded-lg bg-vault-100 dark:bg-vault-800"><Settings className="w-6 h-6 text-vault-600 dark:text-vault-400" /></div><div><h3 className="font-bold text-vault-900 dark:text-white">Settings</h3><p className="text-sm text-vault-500">Coming soon</p></div></div>
        </div>
      </div>
    </>
  );
}
