import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, change, changeType = 'neutral', icon: Icon }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20"><Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" /></div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-sm font-medium ${changeType === 'positive' ? 'text-green-600 dark:text-green-400' : changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-vault-500'}`}>
            {changeType === 'positive' ? <TrendingUp className="w-4 h-4" /> : changeType === 'negative' ? <TrendingDown className="w-4 h-4" /> : null}{change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-vault-500 dark:text-vault-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-vault-900 dark:text-white">{value}</p>
    </div>
  );
}
