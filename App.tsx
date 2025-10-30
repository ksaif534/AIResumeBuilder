
import React, { useState } from 'react';
import { Plan } from './types';
import { PricingPage } from './components/PricingPage';
import { Builder } from './components/Builder';
import { Chatbot } from './components/Chatbot';

const App: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      {!selectedPlan ? (
        <PricingPage onSelectPlan={handleSelectPlan} />
      ) : (
        <>
          <Builder plan={selectedPlan} />
          <Chatbot />
        </>
      )}
    </div>
  );
};

export default App;
