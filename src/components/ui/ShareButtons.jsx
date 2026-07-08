import { Twitter, Facebook, Linkedin, Link2, Mail } from 'lucide-react';
import { useToast } from '@hooks/useToast';
import { trackShare } from '@services/analytics';

export default function ShareButtons({ article, className = '' }) {
  const { toast } = useToast();
  const url = `${window.location.origin}/article/${article.slug}`;
  const text = `${article.title} via @truthvault`;

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, color: 'hover:bg-blue-400 hover:text-white' },
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: 'hover:bg-blue-600 hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, color: 'hover:bg-blue-700 hover:text-white' },
    { name: 'Email', icon: Mail, href: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(url)}`, color: 'hover:bg-vault-600 hover:text-white' },
  ];

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); toast.success('Link copied to clipboard'); trackShare('copy', article.id); }
    catch { toast.error('Failed to copy link'); }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-vault-600 dark:text-vault-400 mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-vault-100 dark:bg-vault-800 text-vault-600 dark:text-vault-400 transition-colors ${link.color}`} aria-label={`Share on ${link.name}`} onClick={() => trackShare(link.name.toLowerCase(), article.id)}><link.icon className="w-4 h-4" /></a>
      ))}
      <button onClick={copyLink} className="p-2 rounded-full bg-vault-100 dark:bg-vault-800 text-vault-600 dark:text-vault-400 hover:bg-vault-600 hover:text-white transition-colors" aria-label="Copy link"><Link2 className="w-4 h-4" /></button>
    </div>
  );
}
