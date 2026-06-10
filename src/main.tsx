import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';
import './index.css';

function Root() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  return <BrowserRouter><App /></BrowserRouter>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
