import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
        setIsRegister(initialMode === 'register');
        // Clear fields and error when modal is opened
        setEmail('');
        setName('');
        setPassword('');
        setError(null);
    }
  }, [isOpen, initialMode]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          throw new Error("All fields are required for registration.");
        }
        await register(name, email, password);
      } else {
        if (!email || !password) {
          throw new Error("Email and password are required to log in.");
        }
        await login(email, password);
      }
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null); // Clear error on new input
    setter(e.target.value);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">{isRegister ? 'Create an Account' : 'Log In'}</h2>
        
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-md p-3 mb-4 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleInputChange(setName)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Your Name"
                required
                disabled={isLoading}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (isRegister ? 'Creating Account...' : 'Logging In...') : (isRegister ? 'Sign Up' : 'Log In')}
          </button>
        </form>
         <p className="text-center text-sm text-gray-400 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsRegister(!isRegister); setError(null); }} className="font-medium text-indigo-400 hover:underline ml-1 disabled:opacity-50" disabled={isLoading}>
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
        </p>
      </div>
    </div>
  );
};
