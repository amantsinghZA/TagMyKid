
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon, LogoutIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={currentUser ? "/" : "/login"} className="flex items-center gap-3 cursor-pointer">
          <LogoIcon className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">TagMyKid</h1>
            <p className="text-sm text-gray-500">Tag it. Scan it. Return it.</p>
          </div>
        </Link>
        {currentUser && (
          <div className="flex items-center gap-4">
             <div className="text-sm text-gray-700 hidden sm:block text-right">
                <p>Welcome, {currentUser.name}!</p>
                <p className="text-xs text-gray-500 font-medium">{currentUser.school}</p>
             </div>
             <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <LogoutIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;