import { useState, useEffect, useCallback } from 'react';
import { createComment, getCommentsByArticle } from '@services/comments';

export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!articleId) return;
    try {
      setLoading(true);
      const data = await getCommentsByArticle(articleId);
      setComments(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [articleId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const addComment = useCallback(async (commentData) => {
    try {
      const newComment = await createComment(articleId, commentData);
      setComments(prev => [newComment, ...prev]);
      return newComment;
    } catch (err) { setError(err.message); throw err; }
  }, [articleId]);

  return { comments, loading, error, addComment, refetch: fetchComments };
}
