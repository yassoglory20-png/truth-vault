import { logEvent } from 'firebase/analytics';
import { analytics } from '@config/firebase';

export function trackPageView(pageTitle, pageLocation) {
  if (analytics) logEvent(analytics, 'page_view', { page_title: pageTitle, page_location: pageLocation });
}

export function trackArticleView(articleId, articleTitle, category) {
  if (analytics) logEvent(analytics, 'article_view', { article_id: articleId, article_title: articleTitle, category });
}

export function trackSearch(query, resultsCount) {
  if (analytics) logEvent(analytics, 'search', { search_term: query, results_count: resultsCount });
}

export function trackShare(method, articleId) {
  if (analytics) logEvent(analytics, 'share', { method, content_id: articleId });
}

export function trackBookmark(action, articleId) {
  if (analytics) logEvent(analytics, 'bookmark', { action, article_id: articleId });
}

export function trackNewsletterSignup(method) {
  if (analytics) logEvent(analytics, 'newsletter_signup', { method });
}
