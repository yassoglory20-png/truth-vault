import { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import { validateEmail } from '@utils/validation';
import { useToast } from '@hooks/useToast';
import { trackNewsletterSignup } from '@services/analytics';

export default function NewsletterForm({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error('Please enter a valid email address'); return; }
    setStatus('loading');
    try {
      const q = query(collection(db, 'subscribers'), where('email', '==', email.toLowerCase()));
      const existing = await getDocs(q);
      if (!existing.empty) { toast.info('You are already subscribed!'); setStatus('success'); return; }
      await addDoc(collection(db, 'subscribers'), {
        email: email.toLowerCase(), name: name.trim() || null,
        subscribedAt: serverTimestamp(), status: 'active', source: window.location.pathname,
      });
      trackNewsletterSignup('website');
      setStatus('success');
      toast.success('Successfully subscribed to the newsletter!');
      setEmail(''); setName('');
    } catch (err) {
      setStatus('error');
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <Check className="w-5 h-5" /><span>Thank you for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {variant === 'expanded' && (
        <div><input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="input" maxLength={100} /></div>
      )}
      <div className="flex gap-2">
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input flex-1" maxLength={200} aria-label="Email address for newsletter" />
        <button type="submit" disabled={status === 'loading'} className="btn-primary px-4" aria-label="Subscribe">
          {status === 'loading' ? <span className="animate-pulse">...</span> : <Send className="w-4 h-4" />}
        </button>
      </div>
      {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-4 h-4" />Something went wrong. Please try again.</p>}
      <p className="text-xs text-vault-500 dark:text-vault-400">No spam. Unsubscribe anytime. We respect your privacy.</p>
    </form>
  );
}
