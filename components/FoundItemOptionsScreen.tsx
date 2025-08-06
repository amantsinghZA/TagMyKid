
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearnerInfo, UserData } from '../types';
import { CameraIcon } from './icons';

const FoundItemOptionsScreen: React.FC = () => {
  const [tagId, setTagId] = useState('');
  const [lookupError, setLookupError] = useState('');
  const navigate = useNavigate();

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');

    if (!tagId || tagId.trim().length !== 6) {
      setLookupError('Please enter a valid 6-character tag ID.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    let foundTag: LearnerInfo | null = null;

    for (const userPhone in users) {
      const userData: UserData = users[userPhone];
      if (userData.tags) {
        const tag = userData.tags.find(t => t.tagId.toUpperCase() === tagId.trim().toUpperCase());
        if (tag) {
          foundTag = {
            ...tag,
            school: tag.school || userData.school,
          };
          break;
        }
      }
    }

    if (foundTag) {
      const encodedData = encodeURIComponent(btoa(JSON.stringify(foundTag)));
      navigate(`/found/${encodedData}`);
    } else {
      setLookupError('Tag ID not found. Please check the code and try again.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fade-in text-center">
      <h2 className="text-3xl font-bold text-gray-900">Find a Lost Item</h2>
      <p className="text-gray-600 mt-2 mb-8">You can scan the QR code or enter the unique ID from the tag.</p>

      <div className="space-y-6">
        <button 
            onClick={() => navigate('/scan')}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
            <CameraIcon className="h-6 w-6" />
            Scan QR Code
        </button>
        
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or enter the ID manually</span>
            </div>
        </div>

        <form onSubmit={handleLookupSubmit} className="space-y-4">
             <div>
                <label htmlFor="tagId" className="sr-only">Tag ID</label>
                <input
                    type="text"
                    id="tagId"
                    value={tagId}
                    onChange={(e) => setTagId(e.target.value.toUpperCase())}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center tracking-[0.2em] font-mono text-lg"
                    placeholder="A4B1C9"
                    maxLength={6}
                    aria-label="Tag ID"
                    autoCapitalize="characters"
                />
                 {lookupError && <p className="text-xs text-red-600 mt-2">{lookupError}</p>}
            </div>
            <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
                Find Item by ID
            </button>
        </form>
      </div>

       <div className="mt-8">
        <button onClick={() => navigate(-1)} className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default FoundItemOptionsScreen;
