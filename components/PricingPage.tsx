
import React from 'react';
import { Plan, PlanDetails } from '../types';
import { PRICING_PLANS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface PricingPageProps {
  onSelectPlan: (plan: Plan) => void;
}

const PlanCard: React.FC<{ plan: PlanDetails; onSelect: () => void }> = ({ plan, onSelect }) => {
  const isPro = plan.name === Plan.Pro;
  return (
    <div className={`relative flex flex-col p-8 rounded-2xl shadow-lg border ${isPro ? 'border-indigo-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}>
      {isPro && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-semibold leading-7">{plan.name}</h3>
      <p className="mt-4 flex items-baseline gap-x-2">
        <span className="text-5xl font-bold tracking-tight text-white">{plan.price}</span>
        {plan.name !== Plan.Free && <span className="text-base text-gray-400">/month</span>}
      </p>
      <p className="mt-6 text-base leading-7 text-gray-300">{`Powered by the ${plan.name === Plan.Free ? 'powerful Gemini Pro' : plan.model} model.`}</p>
      <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isPro ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white'}`}
      >
        {plan.cta}
      </button>
    </div>
  );
};


export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold">
            <SparklesIcon /> AI Resume Builder
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
            Build Your Dream Resume
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Choose a plan that fits your needs and let our AI-powered tools craft the perfect resume and cover letter for your next job application.
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {PRICING_PLANS.map(plan => (
            <PlanCard key={plan.name} plan={plan} onSelect={() => onSelectPlan(plan.name as Plan)} />
          ))}
        </div>
      </div>
    </div>
  );
};
