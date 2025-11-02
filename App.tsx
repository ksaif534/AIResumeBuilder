import React, { useState, useEffect } from 'react';
import { Plan } from './types';
import { PRICING_PLANS } from './constants';
import { PricingPage } from './components/PricingPage';
import { Builder } from './components/Builder';
import { Chatbot } from './components/Chatbot';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Profile } from './components/Profile';
import { handlePurchase } from './services/stripeService';

const AppContent: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [authModalState, setAuthModalState] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({isOpen: false, mode: 'login'});
    const [pendingPlanSelection, setPendingPlanSelection] = useState<Plan | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState<Plan | null>(null);
    
    const { user, upgradePlan } = useAuth();

    useEffect(() => {
        // This effect runs after a user logs in.
        if (user && pendingPlanSelection) {
            const planToProcess = pendingPlanSelection;
            setPendingPlanSelection(null); // Clear pending plan
            // After login, re-run the plan selection logic
            handleSelectPlan(planToProcess); 
        } else if (user && !pendingPlanSelection && authModalState.isOpen === false) {
             // If user just logged in without a pending plan, show profile.
            setShowProfile(true);
        } else if (!user) {
             // User logged out
            setSelectedPlan(null);
            setShowProfile(false);
        }
    }, [user, pendingPlanSelection]);
    
    const handleSelectPlan = async (plan: Plan) => {
        const planDetails = PRICING_PLANS.find(p => p.name === plan);
        if (!planDetails) return;

        // Handle free plan separately
        if (planDetails.name === Plan.Free) {
            if (!user) {
                setPendingPlanSelection(plan);
                setAuthModalState({ isOpen: true, mode: 'login' });
            } else {
                setSelectedPlan(plan);
            }
            return;
        }

        // Handle paid plans
        if (!user) {
            setPendingPlanSelection(plan);
            setAuthModalState({ isOpen: true, mode: 'login' });
        } else {
            // User is logged in, check if they already have a sufficient plan
            const isProUser = user.plan === Plan.Pro;
            const isBasicUser = user.plan === Plan.Basic;

            if (isProUser || (isBasicUser && plan === Plan.Basic)) {
                // User already has access
                setSelectedPlan(plan);
            } else {
                // User needs to purchase
                setIsPurchasing(plan);
                try {
                    // This function now simulates the purchase and returns when complete.
                    await handlePurchase(planDetails);
                    // On "successful" simulation, upgrade the plan and show the builder.
                    upgradePlan(plan);
                    setSelectedPlan(plan);
                } catch (error) {
                    console.error("Simulated purchase failed:", error);
                    alert("There was an issue processing your request. Please try again.");
                } finally {
                    setIsPurchasing(null);
                }
            }
        }
    };

    const handleNavigate = (page: 'home' | 'about' | 'pricing' | 'builder') => {
        if (page === 'home' || page === 'pricing') {
            setSelectedPlan(null);
             if (page === 'pricing') {
                setTimeout(() => {
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else if (page === 'about') {
            alert('About page is a placeholder.');
        } else if (page === 'builder' && !selectedPlan) {
            setSelectedPlan(null); // Go to pricing page to select a plan
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
                    <PricingPage onSelectPlan={handleSelectPlan} isPurchasing={isPurchasing} />
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
                onClose={() => {
                    setAuthModalState({isOpen: false, mode: 'login'});
                    setPendingPlanSelection(null); // Clear pending plan if modal is closed manually
                }}
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