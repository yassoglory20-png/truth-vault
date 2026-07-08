import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || 'https://yourusername.github.io/truth-vault';
const TODAY = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
  { url: '/categories', changefreq: 'weekly', priority: '0.7' },
  { url: '/tags', changefreq: 'weekly', priority: '0.7' },
  { url: '/search', changefreq: 'weekly', priority: '0.6' },
];

const categories = [
  'politics', 'corporate', 'environment', 'technology',
  'health', 'justice', 'education', 'investigations'
];

const tags = [
  'corruption', 'whistleblower', 'data-privacy', 'climate-crisis',
  'human-rights', 'financial-fraud', 'government', 'healthcare',
  'big-tech', 'social-justice', 'transparency', 'accountability'
];

categories.forEach(cat => {
  staticRoutes.push({
    url: `/category/${cat}`,
    changefreq: 'weekly',
    priority: '0.7'
  });
});

tags.forEach(tag => {
  staticRoutes.push({
    url: `/tag/${tag}`,
    changefreq: 'weekly',
    priority: '0.6'
  });
});

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

staticRoutes.forEach(route => {
  sitemap += `  <url>
    <loc>${SITE_URL}${route.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
});

sitemap += '</urlset>';

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully');

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
Host: ${SITE_URL}
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
console.log('robots.txt generated successfully');
