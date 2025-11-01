import React, { useState, useEffect } from 'react';
import { Plan } from './types';
import { PricingPage } from './components/PricingPage';
import { Builder } from './components/Builder';
import { Chatbot } from './components/Chatbot';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [pendingPlanSelection, setPendingPlanSelection] = useState<Plan | null>(null);
    
    const { user } = useAuth();

    useEffect(() => {
        // If user logs in and there was a pending plan selection, complete it.
        if (user && pendingPlanSelection) {
            setSelectedPlan(pendingPlanSelection);
            setPendingPlanSelection(null);
        }
    }, [user, pendingPlanSelection]);
    
    // Reset plan on logout
    useEffect(() => {
        if (!user) {
            setSelectedPlan(null);
        }
    }, [user]);

    const handleSelectPlan = (plan: Plan) => {
        if (!user) {
            setPendingPlanSelection(plan);
            setLoginModalOpen(true);
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
                onLoginClick={() => setLoginModalOpen(true)}
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

            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
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
