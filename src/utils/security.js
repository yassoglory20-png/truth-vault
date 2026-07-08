import DOMPurify from 'dompurify';

export function sanitizeHtml(html) {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'td', 'th', 'code', 'pre', 'hr',
      'div', 'span', 'sup', 'sub'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'loading'
    ],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
  });
}

export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function generateNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getCsrfToken() {
  let token = sessionStorage.getItem('csrfToken');
  if (!token) {
    token = generateNonce();
    sessionStorage.setItem('csrfToken', token);
  }
  return token;
}

export function verifyCsrfToken(token) {
  return token === sessionStorage.getItem('csrfToken');
}
