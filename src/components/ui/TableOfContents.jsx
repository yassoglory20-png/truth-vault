import { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;
    const elements = articleContent.querySelectorAll('h2, h3');
    const items = Array.from(elements).map((el, index) => {
      if (!el.id) el.id = `heading-${index}`;
      return { id: el.id, text: el.textContent, level: el.tagName === 'H2' ? 2 : 3 };
    });
    setHeadings(items);
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveId(entry.target.id); }); },
      { rootMargin: '-100px 0px -60% 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (headings.length === 0) return null;

  return (
    <nav className="card p-6 sticky top-24" aria-label="Table of contents">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 w-full text-left mb-4" aria-expanded={isOpen}>
        <List className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 className="text-lg font-bold text-vault-900 dark:text-white">Contents</h2>
        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button onClick={() => scrollToHeading(heading.id)} className={`text-left text-sm transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${heading.level === 3 ? 'pl-4' : ''} ${activeId === heading.id ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-vault-600 dark:text-vault-400'}`}>
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
