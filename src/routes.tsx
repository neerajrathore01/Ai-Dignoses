import Home from './pages/Home';
import Results from './pages/Results';
import History from './pages/History';
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
    element: <Home />,
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
];

export default routes;