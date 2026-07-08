import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-vault-200 dark:border-vault-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vault-100 dark:hover:bg-vault-800" aria-label="Previous page"><ChevronLeft className="w-5 h-5" /></button>
      {start > 1 && <><button onClick={() => onPageChange(1)} className="px-4 py-2 rounded-lg border border-vault-200 dark:border-vault-700 hover:bg-vault-100 dark:hover:bg-vault-800">1</button>{start > 2 && <span className="px-2 text-vault-400">...</span>}</>}
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page ? 'bg-primary-600 text-white border-primary-600' : 'border-vault-200 dark:border-vault-700 hover:bg-vault-100 dark:hover:bg-vault-800'}`} aria-current={currentPage === page ? 'page' : undefined}>{page}</button>
      ))}
      {end < totalPages && <><{end < totalPages - 1 && <span className="px-2 text-vault-400">...</span>}<button onClick={() => onPageChange(totalPages)} className="px-4 py-2 rounded-lg border border-vault-200 dark:border-vault-700 hover:bg-vault-100 dark:hover:bg-vault-800">{totalPages}</button></>}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-vault-200 dark:border-vault-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vault-100 dark:hover:bg-vault-800" aria-label="Next page"><ChevronRight className="w-5 h-5" /></button>
    </nav>
  );
}
