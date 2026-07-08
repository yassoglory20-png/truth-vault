import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; modalRef.current?.focus(); }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' };
  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === overlayRef.current && onClose()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={modalRef} tabIndex={-1} className={`bg-white dark:bg-vault-800 rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-vault-200 dark:border-vault-700">
          <h2 id="modal-title" className="text-lg font-semibold text-vault-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-vault-100 dark:hover:bg-vault-700 transition-colors" aria-label="Close modal"><X className="w-5 h-5 text-vault-500" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
