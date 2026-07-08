import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '@config/firebase';
import { doc, getDoc, setDoc, deleteDoc, increment, updateDoc } from 'firebase/firestore';

export function useLikes(articleId) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLike() {
      if (!articleId) return;
      try {
        const articleRef = doc(db, 'articles', articleId);
        const articleSnap = await getDoc(articleRef);
        if (articleSnap.exists()) setLikeCount(articleSnap.data().likeCount || 0);
        if (user) {
          const likeRef = doc(db, 'likes', `${articleId}_${user.uid}`);
          const likeSnap = await getDoc(likeRef);
          setLiked(likeSnap.exists());
        }
      } catch (e) { console.error('Error checking like:', e); }
      finally { setLoading(false); }
    }
    checkLike();
  }, [articleId, user]);

  const toggleLike = useCallback(async () => {
    if (!user || !articleId) return;
    const likeRef = doc(db, 'likes', `${articleId}_${user.uid}`);
    const articleRef = doc(db, 'articles', articleId);
    try {
      if (liked) {
        await deleteDoc(likeRef);
        await updateDoc(articleRef, { likeCount: increment(-1) });
        setLikeCount(prev => prev - 1); setLiked(false);
      } else {
        await setDoc(likeRef, { articleId, userId: user.uid, createdAt: new Date().toISOString() });
        await updateDoc(articleRef, { likeCount: increment(1) });
        setLikeCount(prev => prev + 1); setLiked(true);
      }
    } catch (e) { console.error('Error toggling like:', e); }
  }, [liked, user, articleId]);

  return { liked, likeCount, loading, toggleLike };
}
