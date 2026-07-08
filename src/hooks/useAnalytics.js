import { useState, useEffect } from 'react';
import { db } from '@config/firebase';
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore';

export function useAnalytics() {
  const [stats, setStats] = useState({
    totalArticles: 0, totalViews: 0, totalComments: 0, totalSubscribers: 0,
    recentArticles: [], topArticles: [], loading: true, error: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const articlesRef = collection(db, 'articles');
        const commentsRef = collection(db, 'comments');
        const subscribersRef = collection(db, 'subscribers');

        const [articlesSnap, commentsSnap, subscribersSnap, recentSnap, topSnap] = await Promise.all([
          getCountFromServer(articlesRef),
          getCountFromServer(commentsRef),
          getCountFromServer(subscribersRef),
          getDocs(query(articlesRef, orderBy('createdAt', 'desc'), limit(5))),
          getDocs(query(articlesRef, where('status', '==', 'published'), orderBy('viewCount', 'desc'), limit(5))),
        ]);

        const articles = articlesSnap.data().count;
        const comments = commentsSnap.data().count;
        const subscribers = subscribersSnap.data().count;

        const allArticlesSnap = await getDocs(query(articlesRef, limit(1000)));
        const totalViews = allArticlesSnap.docs.reduce((sum, doc) => sum + (doc.data().viewCount || 0), 0);

        setStats({
          totalArticles: articles, totalViews, totalComments: comments, totalSubscribers: subscribers,
          recentArticles: recentSnap.docs.map(d => ({ id: d.id, ...d.data() })),
          topArticles: topSnap.docs.map(d => ({ id: d.id, ...d.data() })),
          loading: false, error: null,
        });
      } catch (err) { setStats(prev => ({ ...prev, loading: false, error: err.message })); }
    }
    fetchStats();
  }, []);

  return stats;
}
