import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Send } from 'lucide-react';
import SEO from '@components/seo/SEO';
import RichTextEditor from '@components/admin/RichTextEditor';
import ImageUploader from '@components/admin/ImageUploader';
import { createArticle, updateArticle, getArticleById } from '@services/articles';
import { useToast } from '@hooks/useToast';
import { useAuth } from '@hooks/useAuth';
import { validateArticle } from '@utils/validation';
import { SITE_CONFIG } from '@config/site';
import LoadingSpinner from '@components/ui/LoadingSpinner';

export default function AdminEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState({
    title: '', slug: '', content: '', excerpt: '', coverImage: '', coverImagePath: '',
    categories: [], tags: [], status: 'draft', featured: false, trending: false,
    metaTitle: '', metaDescription: '',
  });

  useEffect(() => {
    if (id) {
      getArticleById(id).then((data) => {
        if (data) setArticle({ ...data, categories: data.categories || [], tags: data.tags || [] });
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async (status = 'draft') => {
    const validation = validateArticle({ ...article, status });
    if (!validation.isValid) { toast.error(validation.errors.join(', ')); return; }
    setSaving(true);
    try {
      const articleData = { ...article, status };
      if (id) { await updateArticle(id, articleData); toast.success(status === 'published' ? 'Article published!' : 'Draft saved'); }
      else { const newArticle = await createArticle(articleData, user); toast.success(status === 'published' ? 'Article published!' : 'Draft created'); navigate(`/admin/editor/${newArticle.id}`); }
    } catch (err) { toast.error(err.message || 'Failed to save article'); }
    finally { setSaving(false); }
  };

  const toggleCategory = (catId) => {
    setArticle(prev => ({ ...prev, categories: prev.categories.includes(catId) ? prev.categories.filter(c => c !== catId) : [...prev.categories, catId] }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    setArticle(prev => ({ ...prev, tags }));
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <SEO title={id ? 'Edit Article' : 'New Article'} noindex={true} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/articles')} className="p-2 rounded-lg hover:bg-vault-100 dark:hover:bg-vault-800 transition-colors" aria-label="Go back"><ArrowLeft className="w-5 h-5 text-vault-600 dark:text-vault-400" /></button>
            <h1 className="text-2xl font-bold text-vault-900 dark:text-white">{id ? 'Edit Article' : 'New Article'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSave('draft')} disabled={saving} className="btn-secondary inline-flex items-center gap-2"><Save className="w-4 h-4" />Save Draft</button>
            <button onClick={() => handleSave('published')} disabled={saving} className="btn-primary inline-flex items-center gap-2"><Send className="w-4 h-4" />{saving ? 'Publishing...' : 'Publish'}</button>
          </div>
        </div>
        <div className="space-y-6">
          <div><label className="label" htmlFor="article-title">Title *</label><input id="article-title" type="text" value={article.title} onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))} className="input text-lg font-semibold" placeholder="Enter article title..." maxLength={200} /></div>
          <ImageUploader currentImage={article.coverImage} onImageUpload={(url, path) => setArticle(prev => ({ ...prev, coverImage: url, coverImagePath: path }))} />
          <div><label className="label" htmlFor="article-excerpt">Excerpt *</label><textarea id="article-excerpt" value={article.excerpt} onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))} className="input resize-none" rows={3} placeholder="Brief summary of the article..." maxLength={500} /><p className="text-xs text-vault-500 mt-1">{article.excerpt.length}/500</p></div>
          <div><label className="label">Content *</label><RichTextEditor value={article.content} onChange={(content) => setArticle(prev => ({ ...prev, content }))} /></div>
          <div><label className="label">Categories *</label><div className="flex flex-wrap gap-2">{SITE_CONFIG.categories.map((cat) => <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${article.categories.includes(cat.id) ? 'bg-primary-600 text-white' : 'bg-vault-100 dark:bg-vault-800 text-vault-700 dark:text-vault-300 hover:bg-vault-200 dark:hover:bg-vault-700'}`}>{cat.name}</button>)}</div></div>
          <div><label className="label" htmlFor="article-tags">Tags</label><input id="article-tags" type="text" value={article.tags.join(', ')} onChange={handleTagsChange} className="input" placeholder="corruption, whistleblower, data-privacy (comma separated)" /><p className="text-xs text-vault-500 mt-1">Separate tags with commas</p></div>
          <div className="card p-6 bg-vault-50 dark:bg-vault-900/50">
            <h3 className="text-lg font-semibold text-vault-900 dark:text-white mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div><label className="label" htmlFor="meta-title">Meta Title</label><input id="meta-title" type="text" value={article.metaTitle} onChange={(e) => setArticle(prev => ({ ...prev, metaTitle: e.target.value }))} className="input" placeholder="Custom title for search engines..." maxLength={70} /></div>
              <div><label className="label" htmlFor="meta-description">Meta Description</label><textarea id="meta-description" value={article.metaDescription} onChange={(e) => setArticle(prev => ({ ...prev, metaDescription: e.target.value }))} className="input resize-none" rows={2} placeholder="Custom description for search engines..." maxLength={160} /></div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-vault-900 dark:text-white mb-4">Article Settings</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={article.featured} onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))} className="rounded border-vault-300 text-primary-600 focus:ring-primary-500" /><span className="text-sm text-vault-700 dark:text-vault-300">Featured Article</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={article.trending} onChange={(e) => setArticle(prev => ({ ...prev, trending: e.target.checked }))} className="rounded border-vault-300 text-primary-600 focus:ring-primary-500" /><span className="text-sm text-vault-700 dark:text-vault-300">Trending</span></label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
