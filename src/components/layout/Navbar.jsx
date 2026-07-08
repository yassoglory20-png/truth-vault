import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Shield, Bookmark, User } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import SearchModal from '@components/ui/SearchModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-vault-900/90 backdrop-blur-md shadow-sm border-b border-vault-200 dark:border-vault-800' : 'bg-white dark:bg-vault-900 border-b border-transparent'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group" aria-label="Truth Vault Home">
                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold text-vault-900 dark:text-white tracking-tight">Truth<span className="text-primary-600 dark:text-primary-400">Vault</span></span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-vault-600 dark:text-vault-300 hover:text-vault-900 dark:hover:text-white hover:bg-vault-100 dark:hover:bg-vault-800'}`}>{link.name}</Link>
              ))}
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg text-vault-600 dark:text-vault-300 hover:bg-vault-100 dark:hover:bg-vault-800 transition-colors" aria-label="Open search"><Search className="w-5 h-5" /></button>
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link to="/bookmarks" className="p-2 rounded-lg text-vault-600 dark:text-vault-300 hover:bg-vault-100 dark:hover:bg-vault-800" aria-label="Bookmarks"><Bookmark className="w-5 h-5" /></Link>
                  {isAdmin && <Link to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">Admin</Link>}
                  <Link to="/profile" className="p-1 rounded-full bg-vault-200 dark:bg-vault-700" aria-label="Profile"><User className="w-6 h-6 text-vault-700 dark:text-vault-300" /></Link>
                </div>
              ) : (
                <Link to="/admin" className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors">Sign In</Link>
              )}
            </div>
            <div className="flex items-center md:hidden gap-2">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg text-vault-600 dark:text-vault-300" aria-label="Open search"><Search className="w-5 h-5" /></button>
              <ThemeToggle />
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-vault-600 dark:text-vault-300 hover:bg-vault-100 dark:hover:bg-vault-800" aria-expanded={isOpen} aria-label="Toggle menu">{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-vault-900 border-b border-vault-200 dark:border-vault-800">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className={`block px-3 py-2 rounded-lg text-base font-medium ${location.pathname === link.href ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-vault-600 dark:text-vault-300 hover:bg-vault-100 dark:hover:bg-vault-800'}`}>{link.name}</Link>
              ))}
              {user ? (
                <><Link to="/bookmarks" className="block px-3 py-2 rounded-lg text-vault-600 dark:text-vault-300">Bookmarks</Link>
                {isAdmin && <Link to="/admin" className="block px-3 py-2 rounded-lg text-primary-600 dark:text-primary-400">Admin Dashboard</Link>}</>
              ) : <Link to="/admin" className="block px-3 py-2 rounded-lg text-primary-600 dark:text-primary-400">Sign In</Link>}
            </div>
          </div>
        )}
      </nav>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
