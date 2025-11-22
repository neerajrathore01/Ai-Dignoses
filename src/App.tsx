import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from 'miaoda-auth-react';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/db/supabase';
import Header from '@/components/common/Header';
import routes from './routes';

export default function App() {
  return (
    <Router>
      <AuthProvider client={supabase}>
        <Toaster />
        <div className="flex min-h-screen flex-col">
          <Header />
          <RequireAuth whiteList={['/login', '/', '/results', '/history']}>
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
  );
}
