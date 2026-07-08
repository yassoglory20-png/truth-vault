import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import { useAuth } from '@hooks/useAuth';

const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Contact = lazy(() => import('@pages/Contact'));
const Article = lazy(() => import('@pages/Article'));
const Category = lazy(() => import('@pages/Category'));
const Tag = lazy(() => import('@pages/Tag'));
const Search = lazy(() => import('@pages/Search'));
const Author = lazy(() => import('@pages/Author'));
const NotFound = lazy(() => import('@pages/NotFound'));

const AdminLogin = lazy(() => import('@pages/admin/Login'));
const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const AdminArticles = lazy(() => import('@pages/admin/Articles'));
const AdminEditor = lazy(() => import('@pages/admin/Editor'));
const AdminAnalytics = lazy(() => import('@pages/admin/Analytics'));

function ProtectedRoute({ children, requireAdmin = true }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <AdminLogin />;
  if (requireAdmin && user.role !== 'admin' && user.role !== 'editor') return <NotFound />;
  return children;
}

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/tag/:tag" element={<Tag />} />
          <Route path="/search" element={<Search />} />
          <Route path="/author/:authorId" element={<Author />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/articles" element={<ProtectedRoute><AdminArticles /></ProtectedRoute>} />
          <Route path="/admin/editor" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
          <Route path="/admin/editor/:id" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
