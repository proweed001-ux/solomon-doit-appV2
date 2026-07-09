import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PromoPage from './features/promo/PromoPage';
import PromoAdminPage from './features/promo/PromoAdminPage';
import './styles.css';
import './components/FuelBillPage.css';
import './features/promo/PromoModule.css';

function Root() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') || window.location.hash.replace('#', '');

  if (view === 'promo') return <PromoPage />;
  if (view === 'promo-admin') return <PromoAdminPage />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
