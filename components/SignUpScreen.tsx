
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState<{id: string, name: string}[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching schools from a DB like Supabase
    const fetchSchools = async () => {
        setSchoolsLoading(true);
        setTimeout(() => { // Using timeout to mimic network delay
            const mockSchools = [
              { id: '1', name: 'Parktown High School for Girls' },
              { id: '2', name: 'Greenside High School' },
              { id: '3', name: 'Rosebank Primary School' },
              { id: '4', name: 'King Edward VII School' },
              { id: '5', name: 'St. John\'s College' },
              { id: '6', name: 'Roedean School (SA)'},
              { id: '7', name: 'Cornwall Hill College' },
            ];
            setSchools(mockSchools);
            setSelectedSchool('');
            setSchoolsLoading(false);
        }, 500);
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    if (!name || !surname) {
      return setError('Please enter your name and surname.');
    }

    if (!selectedSchool) {
        return setError('Please select your child\'s school.');
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        setError('Please enter a valid phone number.');
        return;
    }

    setError('');
    setLoading(true);
    try {
      await signup(phone, password, name, surname, selectedSchool);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
        <p className="text-gray-600 mt-2">Sign up to start creating tags.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Parent's Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Jane"
              required
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Parent's Surname</label>
            <input 
              type="text" 
              id="surname" 
              name="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Doe"
              required
            />
          </div>
        </div>

        <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700">School</label>
            <select
                id="school"
                name="school"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-200"
                required
                disabled={schoolsLoading}
            >
                <option value="" disabled>{schoolsLoading ? 'Loading schools...' : 'Select a school'}</option>
                {schools.map(school => (
                    <option key={school.id} value={school.name}>{school.name}</option>
                ))}
            </select>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 0821234567"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Minimum 6 characters"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        
        <div className="pt-2">
          <button type="submit" disabled={loading || schoolsLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpScreen;
