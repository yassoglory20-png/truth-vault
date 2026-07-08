import { SITE_CONFIG } from '@config/site';

export function generateMetaTags({
  title, description, image, url, type = 'website',
  publishedAt, modifiedAt, author, tags = [],
}) {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const fullDescription = description || SITE_CONFIG.description;
  const fullImage = image || `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
  const fullUrl = url || SITE_CONFIG.url;

  return {
    title: fullTitle,
    description: fullDescription,
    canonical: fullUrl,
    openGraph: {
      type, title: fullTitle, description: fullDescription,
      url: fullUrl, image: fullImage, siteName: SITE_CONFIG.name,
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(modifiedAt && { modifiedTime: modifiedAt }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image', title: fullTitle,
      description: fullDescription, image: fullImage,
      site: SITE_CONFIG.social.twitter,
      creator: author ? `@${author}` : SITE_CONFIG.social.twitter,
    },
  };
}

export function generateArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: { '@type': 'ImageObject', url: `${SITE_CONFIG.url}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/article/${article.slug}`,
    },
    articleSection: article.categories?.[0],
    keywords: article.tags?.join(', '),
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
