
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LearnerInfo, UserData } from '../types';
import { PlusIcon, QrCodeIcon } from './icons';

const DashboardScreen: React.FC = () => {
  const [tags, setTags] = useState<LearnerInfo[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userData: UserData = users[currentUser.phone];
      if (userData && userData.tags) {
        setTags(userData.tags);
      }
    }
  }, [currentUser]);

  const handleViewQr = (tag: LearnerInfo) => {
    sessionStorage.setItem('learnerInfo', JSON.stringify(tag));
    navigate('/qr');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Tags</h2>
          <p className="text-gray-600 mt-1">Manage tags for your children at {currentUser?.school}.</p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Tag
        </button>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between">
              <div>
                <p className="font-bold text-xl text-gray-800">{tag.name}</p>
                <p className="text-gray-600 mt-1">Grade: {tag.grade} | Class: {tag.className}</p>
              </div>
              <button
                onClick={() => handleViewQr(tag)}
                className="mt-6 w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <QrCodeIcon className="h-5 w-5" />
                View QR Code
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-12 rounded-xl shadow-lg border border-dashed">
          <h3 className="text-xl font-semibold text-gray-800">No Tags Yet!</h3>
          <p className="text-gray-500 mt-2 mb-6">Click the button below to create your first tag.</p>
          <button
            onClick={() => navigate('/create')}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Create Your First Tag
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;