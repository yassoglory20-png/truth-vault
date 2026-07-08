export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password.length >= 8;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 10000);
}

export function validateArticle(article) {
  const errors = [];
  if (!article.title || article.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  if (!article.content || article.content.trim().length < 100) {
    errors.push('Content must be at least 100 characters');
  }
  if (!article.excerpt || article.excerpt.trim().length < 10) {
    errors.push('Excerpt must be at least 10 characters');
  }
  if (!article.categories || article.categories.length === 0) {
    errors.push('At least one category is required');
  }
  return { isValid: errors.length === 0, errors };
}
