import React, { useState, useEffect } from 'react';
import { Plan } from './types';
import { PricingPage } from './components/PricingPage';
import { Builder } from './components/Builder';
import { Chatbot } from './components/Chatbot';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Profile } from './components/Profile';

const AppContent: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [authModalState, setAuthModalState] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({isOpen: false, mode: 'login'});
    const [pendingPlanSelection, setPendingPlanSelection] = useState<Plan | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            if (pendingPlanSelection) {
                setSelectedPlan(pendingPlanSelection);
                setPendingPlanSelection(null);
                // Go to builder, so don't show profile.
                setShowProfile(false);
            } else {
                // If just logging in without a pending plan, show profile.
                setShowProfile(true);
            }
        } else {
            // User logged out
            setSelectedPlan(null);
            setShowProfile(false);
        }
    }, [user, pendingPlanSelection]);
    
    const handleSelectPlan = (plan: Plan) => {
        if (!user) {
            setPendingPlanSelection(plan);
            setAuthModalState({isOpen: true, mode: 'login'});
        } else {
            setSelectedPlan(plan);
        }
    };

    const handleNavigate = (page: 'home' | 'about' | 'pricing' | 'builder') => {
        if (page === 'home' || page === 'pricing') {
            setSelectedPlan(null);
            // Wait for render then scroll for pricing
             if (page === 'pricing') {
                setTimeout(() => {
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } else if (page === 'about') {
            alert('About page is a placeholder.');
        } else if (page === 'builder') {
            // This is handled by selecting a plan, but allows direct navigation if a plan is already selected
            if (!selectedPlan) {
                 // Optionally, navigate to pricing to select a plan first
                 setSelectedPlan(null);
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-900">
            <Header
                onNavigate={handleNavigate}
                onLoginClick={() => setAuthModalState({isOpen: true, mode: 'login'})}
                onRegisterClick={() => setAuthModalState({isOpen: true, mode: 'register'})}
                onProfileDoubleClick={() => setShowProfile(false)}
                isBuilderActive={!!selectedPlan}
            />
            
            <main>
                {!selectedPlan ? (
                    <PricingPage onSelectPlan={handleSelectPlan} />
                ) : (
                    <>
                        <Builder plan={selectedPlan} />
                        <Chatbot />
                    </>
                )}
            </main>

            {showProfile && user && <Profile onClose={() => setShowProfile(false)} />}

            <LoginModal 
                isOpen={authModalState.isOpen}
                onClose={() => setAuthModalState({isOpen: false, mode: 'login'})}
                initialMode={authModalState.mode}
            />
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
