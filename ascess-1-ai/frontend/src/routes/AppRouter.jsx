import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import AiPage from '../pages/AiPage';
import UploadPage from '../pages/UploadPage';
import AccessibilityScannerPage from '../pages/AccessibilityScannerPage';
import TranslationPage from '../pages/TranslationPage';
import VoicePage from '../pages/VoicePage';
import HistoryPage from '../pages/HistoryPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Landing & Error Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Guest Authentication Routes */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        </Route>
      </Route>

      {/* Protected Main Platform Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/accessibility" element={<AccessibilityScannerPage />} />
          <Route path="/translation" element={<TranslationPage />} />
          <Route path="/voice" element={<VoicePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
