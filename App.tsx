
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistrationScreen from './components/RegistrationScreen';
import QRCodeScreen from './components/QRCodeScreen';
import FoundItemScreen from './components/FoundItemScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './components/DashboardScreen';
import QRScannerScreen from './components/QRScannerScreen';
import FoundItemOptionsScreen from './components/FoundItemOptionsScreen';

// This component contains the layout logic based on the current route
const AppLayout: React.FC = () => {
  const location = useLocation();
  const publicPaths = ['/login', '/signup', '/scan', '/found-options'];
  // The view is considered "public" (no header/footer) if it's a login/signup page or the found item page.
  const isPublicView = publicPaths.includes(location.pathname) || location.pathname.startsWith('/found/');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {!isPublicView && <Header />}
      <main className={`flex-grow ${isPublicView ? 'flex items-center justify-center p-4 sm:p-6' : 'container mx-auto px-4 py-6 sm:py-8'}`}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/scan" element={<QRScannerScreen />} />
          <Route path="/found-options" element={<FoundItemOptionsScreen />} />
          <Route path="/found/:data" element={<FoundItemScreen />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <RegistrationScreen />
            </ProtectedRoute>
          } />
          <Route path="/qr" element={
            <ProtectedRoute>
              <QRCodeScreen />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isPublicView && <Footer />}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;