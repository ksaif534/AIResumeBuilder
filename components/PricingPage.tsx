import React from 'react';
import { Plan, PlanDetails } from '../types';
import { PRICING_PLANS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { HeroResumeVisual } from './HeroResumeVisual';

interface PricingPageProps {
  onSelectPlan: (plan: Plan) => void;
  isPurchasing: Plan | null;
}

const PlanCard: React.FC<{ plan: PlanDetails; onSelect: () => void; isPurchasing: boolean }> = ({ plan, onSelect, isPurchasing }) => {
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
        disabled={isPurchasing}
        className={`mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-wait ${isPro ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white'}`}
      >
        {isPurchasing ? 'Processing...' : plan.cta}
      </button>
    </div>
  );
};


export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, isPurchasing }) => {
  const features = [
    {
      name: 'AI-Powered Content',
      description: 'Generate professional summaries, experience bullet points, and entire cover letters with a single click. Our AI understands what recruiters look for.',
      icon: SparklesIcon,
    },
    {
      name: 'Smart Templates',
      description: 'Choose from a variety of professional, recruiter-approved templates that are easy to parse for both humans and applicant tracking systems (ATS).',
      icon: (props: {className?: string}) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      name: 'Career Assistant Chatbot',
      description: 'Get instant advice on your resume, cover letter, or interview preparation from our helpful AI chatbot, available 24/7.',
      icon: (props: {className?: string}) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.182-2.319a9.76 9.76 0 01-.388-2.531C3.75 7.444 7.78 3.75 12.75 3.75c4.97 0 9 3.694 9 8.25v.75Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* --- Hero Section --- */}
        <div className="relative grid lg:grid-cols-2 gap-12 items-center mb-20 md:mb-28">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-indigo-900/50 rounded-full blur-3xl -z-10"></div>
            
            {/* Text Content */}
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-full text-sm text-indigo-400 font-medium">
                    <SparklesIcon className="w-4 h-4" /> 
                    Powered by Gemini
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Craft a Resume That Lands Interviews
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                    Our AI-powered builder helps you create professional, eye-catching resumes and cover letters in minutes. Stand out from the crowd and get your dream job.
                </p>
                <div className="mt-10">
                    <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                        Choose Your Plan
                    </a>
                </div>
            </div>
            
            {/* Visual Content */}
            <div className="hidden lg:flex justify-center items-center">
                <HeroResumeVisual />
            </div>
        </div>

        {/* --- Features Section (About) --- */}
        <div id="about" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Build Faster, Smarter</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to land your dream job</p>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Leverage the power of Google's Gemini AI to create compelling resumes and cover letters that stand out. Our tools analyze your experience and skills to generate professional content tailored to your target job.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                  </div>
                                  {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
        
        {/* --- Pricing Section --- */}
        <div id="pricing">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Choose Your Plan
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                    Pick the perfect plan to jumpstart your career. All plans are powered by advanced AI to give you the best results.
                </p>
            </div>
            <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {PRICING_PLANS.map(plan => (
                <PlanCard key={plan.name} plan={plan} onSelect={() => onSelectPlan(plan.name as Plan)} isPurchasing={isPurchasing === plan.name} />
              ))}
            </div>
        </div>

      </div>
    </div>
  );
};
