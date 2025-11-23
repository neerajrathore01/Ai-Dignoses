import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from 'miaoda-auth-react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { supabase } from '@/db/supabase';
import Header from '@/components/common/Header';
import routes from './routes';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="disease-prediction-theme">
      <Router>
        <AuthProvider client={supabase}>
          <Toaster />
          <div className="flex min-h-screen flex-col">
            <Header />
            <RequireAuth whiteList={['/login', '/', '/analyze', '/results', '/history']}>
              <main className="flex-grow">
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </RequireAuth>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
