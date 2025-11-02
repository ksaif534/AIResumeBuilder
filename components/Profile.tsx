import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
    onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onClose }) => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm m-4 relative text-center" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-4xl uppercase mb-4 border-4 border-gray-700">
                        {user.name.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-md text-gray-400 mt-1">{user.email}</p>
                    <button onClick={onClose} className="mt-8 w-full bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
