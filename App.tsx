import React, { useState } from 'react';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import MainApp from './components/layout/MainApp';
import LandingPage from './components/landing/LandingPage';

type AuthView = 'landing' | 'login' | 'signup';

// Main App Component that uses auth context
const AppContent: React.FC = () => {
  const [authView, setAuthView] = useState<AuthView>('landing');
  const { user, isLoading, isAuthenticated } = useAuthContext();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the main app
  if (isAuthenticated && user) {
    return <MainApp />;
  }

  // If not authenticated, show auth flow
  return (
    <>
      {authView === 'landing' ? (
        <LandingPage 
          onLogin={() => setAuthView('login')} 
          onSignup={() => setAuthView('signup')} 
        />
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 cursor-pointer" onClick={() => setAuthView('landing')}>
              <h1 className="text-3xl font-bold text-indigo-600">SkillMatch</h1>
              <p className="text-gray-600 mt-2">Get an AI-powered edge in your job search.</p>
            </div>
            {authView === 'login' ? (
              <Login onSwitch={() => setAuthView('signup')} />
            ) : (
              <Signup onSwitch={() => setAuthView('login')} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Root App Component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;