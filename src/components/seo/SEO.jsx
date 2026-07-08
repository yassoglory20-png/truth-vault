import { Helmet } from 'react-helmet-async';
import { generateMetaTags } from '@utils/seo';
import { SITE_CONFIG } from '@config/site';

export default function SEO({ title, description, image, url, type = 'website', publishedAt, modifiedAt, author, tags = [], noindex = false }) {
  const meta = generateMetaTags({ title, description, image, url, type, publishedAt, modifiedAt, author, tags });

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:site_name" content={meta.openGraph.siteName} />
      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:url" content={meta.openGraph.url} />
      <meta property="og:image" content={meta.openGraph.image} />
      {meta.openGraph.publishedTime && <meta property="article:published_time" content={meta.openGraph.publishedTime} />}
      {meta.openGraph.modifiedTime && <meta property="article:modified_time" content={meta.openGraph.modifiedTime} />}
      {meta.openGraph.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
      <meta name="twitter:card" content={meta.twitter.card} />
      <meta name="twitter:site" content={meta.twitter.site} />
      <meta name="twitter:creator" content={meta.twitter.creator} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.image} />
      <meta name="author" content={author || SITE_CONFIG.author} />
    </Helmet>
  );
}
