import { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { useComments } from '@hooks/useComments';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useToast';
import { formatRelative } from '@utils/formatDate';

export default function CommentSection({ articleId }) {
  const { comments, loading, addComment } = useComments(articleId);
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ authorName: user?.displayName || '', authorEmail: user?.email || '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim() || formData.content.length < 5) { toast.error('Comment must be at least 5 characters'); return; }
    setSubmitting(true);
    try {
      await addComment(formData);
      setFormData(prev => ({ ...prev, content: '' }));
      toast.success('Comment submitted for moderation');
    } catch (err) { toast.error('Failed to submit comment'); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="mt-12 pt-8 border-t border-vault-200 dark:border-vault-700" aria-label="Comments">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 className="text-2xl font-bold text-vault-900 dark:text-white">Comments ({comments.length})</h2>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-vault-900 dark:text-white mb-4">Leave a Comment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="label" htmlFor="comment-name">Name *</label><input id="comment-name" type="text" required value={formData.authorName} onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))} className="input" maxLength={100} /></div>
          <div><label className="label" htmlFor="comment-email">Email *</label><input id="comment-email" type="email" required value={formData.authorEmail} onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))} className="input" maxLength={200} /></div>
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="comment-content">Comment *</label>
          <textarea id="comment-content" required rows={4} value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} className="input resize-none" maxLength={5000} placeholder="Share your thoughts..." />
          <p className="text-xs text-vault-500 mt-1">{formData.content.length}/5000</p>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary inline-flex items-center gap-2"><Send className="w-4 h-4" />{submitting ? 'Submitting...' : 'Submit Comment'}</button>
        <p className="text-xs text-vault-500 mt-2">Comments are moderated before publication.</p>
      </form>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card p-6 animate-pulse"><div className="h-4 bg-vault-200 dark:bg-vault-700 rounded w-1/4 mb-2" /><div className="h-4 bg-vault-200 dark:bg-vault-700 rounded w-3/4" /></div>)}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-vault-500"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No comments yet. Be the first to share your thoughts!</p></div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <article key={comment.id} className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><User className="w-5 h-5 text-primary-600 dark:text-primary-400" /></div>
                <div>
                  <h4 className="font-medium text-vault-900 dark:text-white">{comment.authorName}</h4>
                  <time className="text-xs text-vault-500 dark:text-vault-400">{formatRelative(comment.createdAt)}</time>
                </div>
              </div>
              <p className="text-vault-700 dark:text-vault-300 whitespace-pre-wrap">{comment.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
