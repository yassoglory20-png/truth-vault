import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import SEO from '@components/seo/SEO';
import StatsCard from '@components/admin/StatsCard';
import { useAnalytics } from '@hooks/useAnalytics';
import { FileText, Eye, Users, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@components/ui/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function AdminAnalytics() {
  const stats = useAnalytics();
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    const labels = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString('en-US', { weekday: 'short' }); });
    setViewData({ labels, datasets: [{ label: 'Page Views', data: [120, 190, 300, 500, 200, 300, 450], backgroundColor: 'rgba(14, 165, 233, 0.5)', borderColor: 'rgba(14, 165, 233, 1)', borderWidth: 2, fill: true }] });
  }, []);

  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Traffic Overview' } }, scales: { y: { beginAtZero: true } } };

  if (stats.loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <SEO title="Analytics" noindex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-vault-900 dark:text-white mb-8">Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Articles" value={stats.totalArticles} icon={FileText} change="+12%" changeType="positive" />
          <StatsCard title="Total Views" value={stats.totalViews.toLocaleString()} icon={Eye} change="+8%" changeType="positive" />
          <StatsCard title="Subscribers" value={stats.totalSubscribers} icon={Users} change="+24%" changeType="positive" />
          <StatsCard title="Avg. Views/Article" value={stats.totalArticles > 0 ? Math.round(stats.totalViews / stats.totalArticles) : 0} icon={TrendingUp} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6"><h2 className="text-lg font-bold text-vault-900 dark:text-white mb-4">Traffic (Last 7 Days)</h2>{viewData && <Line data={viewData} options={chartOptions} />}</div>
          <div className="card p-6"><h2 className="text-lg font-bold text-vault-900 dark:text-white mb-4">Top Categories</h2><div className="space-y-3">{['Politics', 'Corporate', 'Environment', 'Technology'].map((cat, i) => <div key={cat} className="flex items-center gap-3"><div className="w-8 text-sm font-medium text-vault-500">{i + 1}</div><div className="flex-1"><div className="flex justify-between mb-1"><span className="text-sm font-medium text-vault-700 dark:text-vault-300">{cat}</span><span className="text-sm text-vault-500">{100 - i * 20}%</span></div><div className="w-full bg-vault-200 dark:bg-vault-700 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${100 - i * 20}%` }} /></div></div></div>)}</div></div>
        </div>
      </div>
    </>
  );
}
