import { createRoot } from 'react-dom/client';

import App from './App';
import { ContentProvider } from './lib/content-context';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <ContentProvider>
    <App />
  </ContentProvider>,
);
