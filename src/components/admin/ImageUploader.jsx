import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { uploadArticleImage } from '@services/storage';
import { useToast } from '@hooks/useToast';

export default function ImageUploader({ onImageUpload, currentImage = null }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const inputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const result = await uploadArticleImage(file);
      onImageUpload(result.url, result.path);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
      setPreview(currentImage);
    } finally { setUploading(false); }
  };

  const clearImage = () => {
    setPreview(null);
    onImageUpload('', '');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="label">Cover Image</label>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-vault-200 dark:border-vault-700">
          <img src={preview} alt="Cover preview" className="w-full h-48 object-cover" />
          <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors" aria-label="Remove image"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="w-full h-48 rounded-lg border-2 border-dashed border-vault-300 dark:border-vault-600 flex flex-col items-center justify-center gap-2 text-vault-500 hover:border-primary-500 hover:text-primary-500 transition-colors">
          <ImageIcon className="w-8 h-8" />
          <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Click to upload cover image'}</span>
          <span className="text-xs text-vault-400">PNG, JPG, WebP up to 5MB</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileSelect} className="hidden" aria-label="Upload image" />
    </div>
  );
}
