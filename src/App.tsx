import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AuthPage from './pages/AuthPage';
import RecordPage from './pages/RecordPage';
import ActivitiesPage from './pages/ActivitiesPage';
import DetailPage from './pages/DetailPage';
import SharePage from './pages/SharePage';
import Layout from './components/Layout';

export default function App() {
  const { session, loading } = useAuthStore();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-brand text-2xl">⚡</div>
    </div>
  );

  if (!session) return <AuthPage />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/record" replace />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
      </Route>
      <Route path="/activity/:id" element={<DetailPage />} />
      <Route path="/share/:id" element={<SharePage />} />
      <Route path="*" element={<Navigate to="/record" replace />} />
    </Routes>
  );
}
