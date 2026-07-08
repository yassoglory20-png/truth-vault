import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Github, Rss, Mail } from 'lucide-react';
import NewsletterForm from '@components/ui/NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    Platform: [
      { name: 'Home', href: '/' }, { name: 'Categories', href: '/categories' },
      { name: 'Search', href: '/search' }, { name: 'About', href: '/about' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' }, { name: 'Terms of Service', href: '/terms' },
      { name: 'Ethics Policy', href: '/ethics' }, { name: 'Corrections', href: '/corrections' },
    ],
    Connect: [
      { name: 'Contact', href: '/contact' }, { name: 'Submit a Tip', href: '/contact?tip=true' },
      { name: 'Careers', href: '/careers' }, { name: 'Partnerships', href: '/partnerships' },
    ],
  };

  return (
    <footer className="bg-vault-900 dark:bg-vault-950 text-vault-300 border-t border-vault-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">Truth<span className="text-primary-400">Vault</span></span>
            </Link>
            <p className="text-sm text-vault-400 mb-6">Independent investigative journalism committed to uncovering facts, exposing corruption, and amplifying voices that matter.</p>
            <div className="flex gap-4">
              <a href="https://twitter.com/truthvault" target="_blank" rel="noopener noreferrer" className="text-vault-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="https://facebook.com/truthvault" target="_blank" rel="noopener noreferrer" className="text-vault-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="https://github.com/truthvault" target="_blank" rel="noopener noreferrer" className="text-vault-400 hover:text-white transition-colors" aria-label="GitHub"><Github className="w-5 h-5" /></a>
              <a href="/rss.xml" className="text-vault-400 hover:text-white transition-colors" aria-label="RSS Feed"><Rss className="w-5 h-5" /></a>
              <a href="mailto:editor@truthvault.com" className="text-vault-400 hover:text-white transition-colors" aria-label="Email"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}><Link to={link.href} className="text-sm text-vault-400 hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-vault-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-vault-400 mb-4">Get the latest investigative reports delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-vault-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-vault-500">&copy; {currentYear} Truth Vault. All rights reserved.</p>
          <p className="text-sm text-vault-500">Built with integrity. Powered by truth.</p>
        </div>
      </div>
    </footer>
  );
}
