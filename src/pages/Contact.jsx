import { useState } from 'react';
import { Send, Mail, MapPin, AlertTriangle } from 'lucide-react';
import SEO from '@components/seo/SEO';
import { sendContactEmail } from '@services/email';
import { validateEmail, sanitizeInput } from '@utils/validation';
import { useToast } from '@hooks/useToast';
import { SITE_CONFIG } from '@config/site';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', isTip: false });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) { toast.error('Please fill in all required fields'); return; }
    if (!validateEmail(formData.email)) { toast.error('Please enter a valid email address'); return; }
    setSubmitting(true);
    const result = await sendContactEmail({
      name: sanitizeInput(formData.name), email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject) || 'General Inquiry', message: sanitizeInput(formData.message),
    });
    if (result.success) { toast.success('Message sent successfully! We will get back to you soon.'); setFormData({ name: '', email: '', subject: '', message: '', isTip: false }); }
    else { toast.error(result.error || 'Failed to send message. Please try again.'); }
    setSubmitting(false);
  };

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with Truth Vault. Submit tips, corrections, or general inquiries." url={`${SITE_CONFIG.url}/contact`} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-vault-900 dark:text-white mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card p-6 text-center"><Mail className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" /><h3 className="font-bold text-vault-900 dark:text-white mb-1">Email</h3><p className="text-sm text-vault-600 dark:text-vault-400">editor@truthvault.com</p></div>
          <div className="card p-6 text-center"><MapPin className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" /><h3 className="font-bold text-vault-900 dark:text-white mb-1">Location</h3><p className="text-sm text-vault-600 dark:text-vault-400">Global &middot; Remote First</p></div>
          <div className="card p-6 text-center"><AlertTriangle className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" /><h3 className="font-bold text-vault-900 dark:text-white mb-1">Secure Tips</h3><p className="text-sm text-vault-600 dark:text-vault-400">PGP Key Available</p></div>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-vault-900 dark:text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="label" htmlFor="contact-name">Name *</label><input id="contact-name" type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input" maxLength={100} /></div>
              <div><label className="label" htmlFor="contact-email">Email *</label><input id="contact-email" type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input" maxLength={200} /></div>
            </div>
            <div><label className="label" htmlFor="contact-subject">Subject</label><input id="contact-subject" type="text" value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="input" maxLength={200} placeholder="What is this regarding?" /></div>
            <div><label className="label" htmlFor="contact-message">Message *</label><textarea id="contact-message" required rows={6} value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} className="input resize-none" maxLength={5000} placeholder="Your message..." /><p className="text-xs text-vault-500 mt-1">{formData.message.length}/5000</p></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is-tip" checked={formData.isTip} onChange={(e) => setFormData(prev => ({ ...prev, isTip: e.target.checked }))} className="rounded border-vault-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="is-tip" className="text-sm text-vault-700 dark:text-vault-300">This is a confidential tip</label>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary inline-flex items-center gap-2"><Send className="w-4 h-4" />{submitting ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </div>
    </>
  );
}
