import Landing from './pages/Landing';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import History from './pages/History';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Landing />,
    visible: true,
  },
  {
    name: 'Analyze',
    path: '/analyze',
    element: <Analyze />,
    visible: true,
  },
  {
    name: 'Results',
    path: '/results',
    element: <Results />,
    visible: false,
  },
  {
    name: 'History',
    path: '/history',
    element: <History />,
    visible: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false,
  },
];

export default routes;