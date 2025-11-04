import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onNavigate: (page: 'home' | 'about' | 'pricing' | 'builder') => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onProfileDoubleClick: () => void;
    isBuilderActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onLoginClick, onRegisterClick, onProfileDoubleClick, isBuilderActive }) => {
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
        onNavigate('home');
    };

    const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, page: 'home' | 'about' | 'pricing' | 'builder') => {
        event.preventDefault();
        onNavigate(page);
        setMobileMenuOpen(false);
    }
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);


    return (
        <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Left Nav */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="text-white font-bold text-xl">
                                Resu<span className="text-indigo-400">AI</span>
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                                <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
                                <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                                {user && isBuilderActive && <a href="#" onClick={(e) => handleNavClick(e, 'builder')} className="text-indigo-400 font-semibold hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm">Builder</a>}
                            </div>
                        </div>
                    </div>

                    {/* Right Nav: Auth */}
                    <div className="hidden md:block">
                        {user ? (
                            <div ref={profileMenuRef} onDoubleClick={onProfileDoubleClick} className="ml-4 flex items-center md:ml-6 relative">
                                <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} type="button" className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded={isProfileMenuOpen} aria-haspopup="true">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <p className="text-sm text-gray-300">Signed in as</p>
                                            <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                        </div>
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" role="menuitem">Log out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={onLoginClick} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition-colors">
                                    Log In
                                </button>
                                <button onClick={onRegisterClick} className="bg-transparent border border-indigo-500 text-indigo-400 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-500/20 transition-colors">
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
                        <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
                        <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
                        {user && isBuilderActive && <a href="#" onClick={(e) => handleNavClick(e, 'builder')} className="text-indigo-400 font-semibold hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base">Builder</a>}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        {user ? (
                            <>
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold uppercase">
                                            {user.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Log out</button>
                                </div>
                            </>
                        ) : (
                             <div className="px-5 flex flex-col gap-2">
                                <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full text-center bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-base hover:bg-indigo-500 transition-colors">
                                    Log In
                                </button>
                                <button onClick={() => { onRegisterClick(); setMobileMenuOpen(false); }} className="w-full text-center bg-transparent border border-indigo-500 text-indigo-400 font-semibold px-3 py-2 rounded-lg text-base hover:bg-indigo-500/20 transition-colors">
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
