import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const HeroResumeVisual: React.FC = () => {
  return (
    <div className="relative transform-gpu" style={{ perspective: '1000px' }}>
      <div
        className="relative rounded-2xl shadow-2xl transition-transform duration-500 ease-in-out hover:rotate-0"
        style={{ transform: 'rotateX(10deg) rotateY(-8deg) rotateZ(2deg)' }}
      >
        <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-500/80 rounded-2xl transform -translate-x-2 -translate-y-2 -z-10"></div>
        <div className="bg-white text-gray-800 p-6 rounded-2xl relative w-full max-w-md border border-gray-200">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Alex Doe</h1>
            <p className="text-xs text-gray-500">alex.doe@email.com | (555) 123-4567 | San Francisco, CA</p>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-xs font-bold uppercase text-indigo-600 border-b-2 border-indigo-200 pb-1 mb-2">Summary</h2>
            <p className="text-xs text-gray-600">
              Highly motivated Software Engineer with a passion for creating...
              <span className="bg-indigo-100 text-indigo-800 rounded px-1 ml-1 text-[10px] inline-flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" /> AI Enhanced
              </span>
            </p>
          </div>

          {/* Section */}
          <div className="mt-4">
            <h2 className="text-xs font-bold uppercase text-indigo-600 border-b-2 border-indigo-200 pb-1 mb-2">Experience</h2>
            <h3 className="text-sm font-semibold text-gray-800">Senior Developer</h3>
            <p className="text-xs text-gray-500 italic">Innovate Inc. | 2021 - Present</p>
            <div className="h-2 mt-1 bg-gray-200 rounded-full w-full"></div>
            <div className="h-2 mt-1 bg-gray-200 rounded-full w-3/4"></div>
          </div>
          
          {/* Section */}
          <div className="mt-4">
            <h2 className="text-xs font-bold uppercase text-indigo-600 border-b-2 border-indigo-200 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1 mt-1">
                <span className="bg-gray-200 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">React</span>
                <span className="bg-gray-200 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">TypeScript</span>
                <span className="bg-gray-200 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">Node.js</span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-medium px-2 py-0.5 rounded-full">Gemini API</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
              <SparklesIcon className="w-8 h-8 text-indigo-400 opacity-30"/>
          </div>

        </div>
      </div>
    </div>
  );
};