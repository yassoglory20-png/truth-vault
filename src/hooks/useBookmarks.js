import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { db } from '@config/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

export function useBookmarks() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  useEffect(() => { if (user?.bookmarks) setBookmarkedArticles(user.bookmarks); }, [user?.bookmarks]);

  const isBookmarked = useCallback((articleId) => bookmarkedArticles.includes(articleId), [bookmarkedArticles]);

  const toggleBookmark = useCallback(async (articleId) => {
    if (!user) { toast.error('Please sign in to bookmark articles'); return; }
    const userRef = doc(db, 'users', user.uid);
    const articleRef = doc(db, 'articles', articleId);
    try {
      if (isBookmarked(articleId)) {
        await updateDoc(userRef, { bookmarks: arrayRemove(articleId) });
        await updateDoc(articleRef, { bookmarkCount: increment(-1) });
        setBookmarkedArticles(prev => prev.filter(id => id !== articleId));
        toast.success('Removed from bookmarks');
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(articleId) });
        await updateDoc(articleRef, { bookmarkCount: increment(1) });
        setBookmarkedArticles(prev => [...prev, articleId]);
        toast.success('Added to bookmarks');
      }
      refreshUser();
    } catch (e) { toast.error('Failed to update bookmark'); console.error(e); }
  }, [user, isBookmarked, refreshUser, toast]);

  return { bookmarkedArticles, isBookmarked, toggleBookmark };
}

export function useArticleBookmark(articleId) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !articleId) { setLoading(false); return; }
    const checkBookmark = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setBookmarked(userSnap.data().bookmarks?.includes(articleId) || false);
      setLoading(false);
    };
    checkBookmark();
  }, [user, articleId]);

  const toggle = useCallback(async () => {
    if (!user) { toast.error('Please sign in to bookmark'); return; }
    const userRef = doc(db, 'users', user.uid);
    const articleRef = doc(db, 'articles', articleId);
    try {
      if (bookmarked) {
        await updateDoc(userRef, { bookmarks: arrayRemove(articleId) });
        await updateDoc(articleRef, { bookmarkCount: increment(-1) });
        setBookmarked(false); toast.success('Removed from bookmarks');
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(articleId) });
        await updateDoc(articleRef, { bookmarkCount: increment(1) });
        setBookmarked(true); toast.success('Saved to bookmarks');
      }
    } catch (e) { toast.error('Error updating bookmark'); }
  }, [bookmarked, user, articleId, toast]);

  return { bookmarked, loading, toggleBookmark: toggle };
}
