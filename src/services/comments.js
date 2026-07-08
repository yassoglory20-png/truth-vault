import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from '@config/firebase';

const commentsCollection = collection(db, 'comments');

export async function createComment(articleId, commentData) {
  const comment = {
    articleId,
    authorName: commentData.authorName?.slice(0, 100) || 'Anonymous',
    authorEmail: commentData.authorEmail?.slice(0, 200) || '',
    content: commentData.content?.slice(0, 5000) || '',
    parentId: commentData.parentId || null,
    status: 'pending',
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(commentsCollection, comment);
  const articleRef = doc(db, 'articles', articleId);
  await updateDoc(articleRef, { commentCount: increment(1) });
  return { id: docRef.id, ...comment };
}

export async function getCommentsByArticle(articleId, includePending = false) {
  let constraints = [where('articleId', '==', articleId), orderBy('createdAt', 'desc')];
  if (!includePending) constraints.unshift(where('status', '==', 'approved'));
  const q = query(commentsCollection, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function approveComment(id) {
  await updateDoc(doc(db, 'comments', id), { status: 'approved' });
}

export async function rejectComment(id) {
  await updateDoc(doc(db, 'comments', id), { status: 'rejected' });
}

export async function deleteComment(id, articleId) {
  await deleteDoc(doc(db, 'comments', id));
  const articleRef = doc(db, 'articles', articleId);
  await updateDoc(articleRef, { commentCount: increment(-1) });
}

export async function getPendingComments(limitCount = 50) {
  const q = query(commentsCollection, where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
