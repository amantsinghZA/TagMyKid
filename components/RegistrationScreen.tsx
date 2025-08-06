
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LearnerInfo, UserData } from '../types';
import { useAuth } from '../contexts/AuthContext';

const RegistrationScreen: React.FC = () => {
  const [learnerInfo, setLearnerInfo] = useState({
    name: '',
    grade: '',
    className: '',
    parentPhone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'grade') {
        value = value.replace(/[^0-9]/g, '');
    }
    
    if (name === 'className') {
        value = value.replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase();
    }

    setLearnerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError("You must be logged in to create a tag.");
      return;
    }

    if (!learnerInfo.name || !learnerInfo.grade || !learnerInfo.className || !learnerInfo.parentPhone) {
      setError('All fields are required.');
      return;
    }
    const phoneDigits = learnerInfo.parentPhone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        setError('Please enter a valid phone number.');
        return;
    }
    
    const gradeNum = parseInt(learnerInfo.grade, 10);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 12) {
        setError('Grade must be a number between 0 and 12.');
        return;
    }
    
    if (!/^[A-Z]$/.test(learnerInfo.className)) {
        setError('Class Name must be a single letter from A to Z.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData: UserData = users[currentUser.phone];

    if (userData && userData.tags) {
      const exists = userData.tags.some(tag => 
        tag.name.toLowerCase() === learnerInfo.name.toLowerCase() &&
        tag.grade === learnerInfo.grade &&
        tag.className.toUpperCase() === learnerInfo.className.toUpperCase()
      );

      if (exists) {
        setError('A tag for this child already exists. You can view it on your dashboard.');
        return;
      }
    }
    
    const tagId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTag: LearnerInfo = {
      ...learnerInfo,
      school: currentUser.school,
      tagId,
    };
    
    const updatedUserData = {
      ...userData,
      tags: [...(userData.tags || []), newTag]
    };
    users[currentUser.phone] = updatedUserData;
    localStorage.setItem('users', JSON.stringify(users));

    sessionStorage.setItem('learnerInfo', JSON.stringify(newTag));
    navigate('/qr');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create a New Tag</h2>
        <p className="text-gray-600 mt-2">Enter your child's details to generate a unique QR code.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Child's Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={learnerInfo.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Thandi Dlamini"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
            <input 
              type="text" 
              id="grade" 
              name="grade" 
              value={learnerInfo.grade}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5"
              required
              inputMode="numeric"
              pattern="\d*"
            />
            <p className="mt-1 text-xs text-gray-500">Numeric, 0-12</p>
          </div>
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
            <input 
              type="text" 
              id="className" 
              name="className" 
              value={learnerInfo.className}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., B"
              required
              maxLength={1}
            />
            <p className="mt-1 text-xs text-gray-500">Single letter, A-Z</p>
          </div>
        </div>

        <div>
          <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">Parent's WhatsApp Number</label>
          <input 
            type="tel" 
            id="parentPhone" 
            name="parentPhone" 
            value={learnerInfo.parentPhone}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 0821234567"
            required
          />
          <p className="mt-2 text-xs text-gray-500">Use local format (e.g. 082...) or international (e.g. +2782...).</p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        
        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Dashboard
          </button>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Generate QR Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationScreen;
