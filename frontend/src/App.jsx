import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Auth from './Auth';

function App() {
  const [businessId, setBusinessId] = useState(() => {
    const id = localStorage.getItem('finhealth_biz_id');
    return (id && id !== 'undefined' && id !== 'null') ? id : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem('finhealth_auth');
    const id = localStorage.getItem('finhealth_biz_id');
    return auth === 'true' && (id && id !== 'undefined' && id !== 'null');
  });

  const handleLogin = (bizId) => {
    const sid = String(bizId);
    localStorage.setItem('finhealth_auth', 'true');
    localStorage.setItem('finhealth_biz_id', sid);
    setBusinessId(sid);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('finhealth_auth');
    localStorage.removeItem('finhealth_biz_id');
    setBusinessId(null);
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated && businessId ? (
        <Dashboard onLogout={handleLogout} businessId={businessId} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
