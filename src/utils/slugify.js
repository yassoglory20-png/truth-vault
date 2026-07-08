export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateSlug(title, id) {
  const baseSlug = slugify(title);
  const uniqueId = id ? id.slice(-6) : Date.now().toString(36);
  return `${baseSlug}-${uniqueId}`;
}
