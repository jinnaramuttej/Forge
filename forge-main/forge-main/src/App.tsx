import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Introducing from './components/Introducing';
import OperatingSuite from './components/OperatingSuite';
import HowItWorks from './components/HowItWorks';
import ProductPreview from './components/ProductPreview';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import DashboardView from './components/DashboardView';

type ViewMode = 'landing' | 'login' | 'dashboard';

function App() {
  const [view, setView] = useState<ViewMode>('landing');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#enter' || window.location.hash === '#login') {
        setView('login');
      } else if (window.location.hash === '#dashboard') {
        setView('dashboard');
      } else if (window.location.hash === '#top' || window.location.hash === '') {
        // preserve landing
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openLogin = () => {
    window.location.hash = 'enter';
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToLanding = () => {
    window.location.hash = '';
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enterDashboard = () => {
    window.location.hash = 'dashboard';
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'login') {
    return (
      <LoginPage
        onBack={backToLanding}
        onSuccess={enterDashboard}
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <DashboardView
        onLogout={backToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onEnterForge={openLogin} />
      <main>
        <Hero onEnterForge={openLogin} />
        <Problem />
        <Introducing />
        <OperatingSuite onEnterForge={openLogin} />
        <HowItWorks />
        <ProductPreview onEnterForge={openLogin} />
        <FinalCTA onEnterForge={openLogin} />
      </main>
      <Footer onEnterForge={openLogin} />
    </div>
  );
}

export default App;
