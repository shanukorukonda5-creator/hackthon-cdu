import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SidebarProvider } from './context/SidebarContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <SettingsProvider>
            <AccessibilityProvider>
              <SidebarProvider>
                <NotificationProvider>
                  <AuthProvider>
                    <AppRouter />
                  </AuthProvider>
                </NotificationProvider>
              </SidebarProvider>
            </AccessibilityProvider>
          </SettingsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
