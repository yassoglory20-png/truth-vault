import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, serverTimestamp,
  increment, writeBatch,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { generateSlug } from '@utils/slugify';

const articlesCollection = collection(db, 'articles');

export async function createArticle(articleData, author) {
  const slug = generateSlug(articleData.title);
  const readingTime = Math.ceil(articleData.content.split(/\s+/).length / 200);
  const article = {
    ...articleData, slug, authorId: author.uid,
    authorName: author.displayName || 'Anonymous',
    authorEmail: author.email, readingTime,
    viewCount: 0, likeCount: 0, bookmarkCount: 0, commentCount: 0,
    status: articleData.status || 'draft',
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    publishedAt: articleData.status === 'published' ? serverTimestamp() : null,
  };
  const docRef = await addDoc(articlesCollection, article);
  return { id: docRef.id, ...article };
}

export async function updateArticle(id, updates) {
  const articleRef = doc(db, 'articles', id);
  const updateData = { ...updates, updatedAt: serverTimestamp() };
  if (updates.status === 'published') {
    const currentDoc = await getDoc(articleRef);
    if (!currentDoc.data().publishedAt) updateData.publishedAt = serverTimestamp();
  }
  await updateDoc(articleRef, updateData);
  return { id, ...updateData };
}

export async function deleteArticle(id) {
  await deleteDoc(doc(db, 'articles', id));
}

export async function getArticleBySlug(slug) {
  const q = query(articlesCollection, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function getArticleById(id) {
  const docRef = doc(db, 'articles', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function incrementViewCount(articleId) {
  const articleRef = doc(db, 'articles', articleId);
  try { await updateDoc(articleRef, { viewCount: increment(1) }); } catch (e) { console.error(e); }
}

export async function getArticles(options = {}) {
  const {
    status = 'published', category = null, tag = null,
    featured = false, trending = false, limit: queryLimit = 10,
    startAfter: startAfterDoc = null, orderByField = 'publishedAt', orderDirection = 'desc',
  } = options;
  let constraints = [where('status', '==', status)];
  if (category) constraints.push(where('categories', 'array-contains', category));
  if (tag) constraints.push(where('tags', 'array-contains', tag));
  if (featured) constraints.push(where('featured', '==', true));
  if (trending) constraints.push(where('trending', '==', true));
  constraints.push(orderBy(orderByField, orderDirection));
  constraints.push(limit(queryLimit));
  if (startAfterDoc) constraints.push(startAfter(startAfterDoc));
  const q = query(articlesCollection, ...constraints);
  const snapshot = await getDocs(q);
  return {
    articles: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === queryLimit,
  };
}

export async function getAllArticles(limitCount = 100) {
  const q = query(articlesCollection, orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function searchArticles(searchTerm, limitCount = 20) {
  const titleQuery = query(
    articlesCollection,
    where('status', '==', 'published'),
    where('title', '>=', searchTerm),
    where('title', '<=', searchTerm + '\uf8ff'),
    limit(limitCount)
  );
  const snapshot = await getDocs(titleQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getFeaturedArticles(limitCount = 5) {
  return getArticles({ featured: true, limit: limitCount });
}

export async function getTrendingArticles(limitCount = 5) {
  return getArticles({ trending: true, limit: limitCount });
}

export async function getRelatedArticles(articleId, categories, tags, limitCount = 4) {
  const q = query(
    articlesCollection,
    where('status', '==', 'published'),
    where('categories', 'array-contains-any', categories.slice(0, 10)),
    orderBy('publishedAt', 'desc'),
    limit(limitCount + 1)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(article => article.id !== articleId)
    .slice(0, limitCount);
}

export async function toggleFeatured(id, featured) {
  const articleRef = doc(db, 'articles', id);
  await updateDoc(articleRef, { featured, updatedAt: serverTimestamp() });
}

export async function toggleTrending(id, trending) {
  const articleRef = doc(db, 'articles', id);
  await updateDoc(articleRef, { trending, updatedAt: serverTimestamp() });
}

export async function batchUpdateStatus(ids, status) {
  const batch = writeBatch(db);
  ids.forEach(id => {
    const ref = doc(db, 'articles', id);
    batch.update(ref, { status, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
