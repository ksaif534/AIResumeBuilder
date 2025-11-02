import React, { useState, useCallback, useRef } from 'react';
import { Plan, UserInfo, CoverLetterInfo, WorkExperience, Education } from '../types';
import { PRICING_PLANS, INITIAL_USER_INFO, INITIAL_COVER_LETTER_INFO } from '../constants';
import { generateContent, generateContentWithSearch } from '../services/geminiService';
import { ResumePreview } from './ResumePreview';
import { SparklesIcon } from './icons/SparklesIcon';
import { CoverLetterPreview } from './CoverLetterPreview';

// Add declarations for window-injected libraries to satisfy TypeScript
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

interface BuilderProps {
  plan: Plan;
}

enum View {
    Resume = 'Resume',
    CoverLetter = 'Cover Letter',
}

const AIGenerateButton: React.FC<{ onClick: () => void; isLoading: boolean }> = ({ onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
    title="Generate with AI"
  >
    {isLoading ? (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <SparklesIcon className="w-5 h-5" />
    )}
  </button>
);


export const Builder: React.FC<BuilderProps> = ({ plan }) => {
  const [activeView, setActiveView] = useState<View>(View.Resume);
  const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_USER_INFO);
  const [coverLetterInfo, setCoverLetterInfo] = useState<CoverLetterInfo>(INITIAL_COVER_LETTER_INFO);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [coverLetterSources, setCoverLetterSources] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const selectedPlanDetails = PRICING_PLANS.find(p => p.name === plan)!;
  const model = selectedPlanDetails.model;
  
  const handleUserInfoChange = (field: keyof UserInfo, value: any) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNestedChange = <K extends 'experience' | 'education'>(
    section: K,
    id: string,
    field: keyof UserInfo[K][number],
    value: string
  ) => {
    setUserInfo(prev => ({
        ...prev,
        [section]: prev[section].map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ),
    }));
  };

  const runAIGeneration = useCallback(async <T,>(
    loaderKey: string,
    prompt: string,
    onSuccess: (result: T) => void,
    useSearch: boolean = false
  ) => {
    setLoadingStates(prev => ({ ...prev, [loaderKey]: true }));
    try {
        if (useSearch) {
            const { text, sources } = await generateContentWithSearch(prompt);
            onSuccess({ text, sources } as T);
        } else {
            const result = await generateContent(prompt, model);
            onSuccess(result as T);
        }
    } catch (error) {
        console.error(`Error during AI generation for ${loaderKey}:`, error);
    } finally {
        setLoadingStates(prev => ({ ...prev, [loaderKey]: false }));
    }
  }, [model]);

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) {
        console.error("Preview element not found");
        return;
    }

    setIsDownloading(true);

    try {
        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        if (!jsPDF || !html2canvas) {
            alert("PDF generation library is not loaded. Please refresh the page.");
            setIsDownloading(false);
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pdf.internal.pageSize.getHeight();
        }
        
        const fileName = activeView === View.Resume 
            ? `Resume-${userInfo.fullName.replace(/\s/g, '_')}.pdf`
            : `CoverLetter-${userInfo.fullName.replace(/\s/g, '_')}.pdf`;
            
        pdf.save(fileName);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Left Panel: Form */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
        <p className="text-indigo-400 mb-6">Plan: <span className="font-semibold">{plan}</span> ({model})</p>

        <div className="flex border-b border-gray-700 mb-6">
          <button onClick={() => setActiveView(View.Resume)} className={`py-2 px-4 text-sm font-medium ${activeView === View.Resume ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Resume</button>
          <button onClick={() => setActiveView(View.CoverLetter)} className={`py-2 px-4 text-sm font-medium ${activeView === View.CoverLetter ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Cover Letter</button>
        </div>

        {activeView === View.Resume && (
          <div className="space-y-6">
             {/* Personal Details */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Personal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={userInfo.fullName} onChange={e => handleUserInfoChange('fullName', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full" />
                  <input type="email" placeholder="Email" value={userInfo.email} onChange={e => handleUserInfoChange('email', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full" />
                  <input type="tel" placeholder="Phone" value={userInfo.phone} onChange={e => handleUserInfoChange('phone', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full" />
                  <input type="text" placeholder="Address" value={userInfo.address} onChange={e => handleUserInfoChange('address', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full" />
              </div>
            </div>
            {/* Summary */}
            <div className="relative">
              <h2 className="text-xl font-semibold mb-3">Professional Summary</h2>
              <textarea placeholder="Professional Summary" value={userInfo.summary} onChange={e => handleUserInfoChange('summary', e.target.value)} rows={4} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full pr-10"></textarea>
              <AIGenerateButton isLoading={loadingStates['summary']} onClick={() => runAIGeneration<string>('summary', `Generate a professional summary for a resume based on this information: ${JSON.stringify({experience: userInfo.experience, skills: userInfo.skills})}`, result => handleUserInfoChange('summary', result))} />
            </div>
             {/* Work Experience */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Work Experience</h2>
              {userInfo.experience.map((exp) => (
                <div key={exp.id} className="p-4 border border-gray-700 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleNestedChange('experience', exp.id, 'jobTitle', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm"/>
                        <input type="text" placeholder="Company" value={exp.company} onChange={e => handleNestedChange('experience', exp.id, 'company', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm"/>
                        <input type="text" placeholder="Start Date" value={exp.startDate} onChange={e => handleNestedChange('experience', exp.id, 'startDate', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm"/>
                        <input type="text" placeholder="End Date" value={exp.endDate} onChange={e => handleNestedChange('experience', exp.id, 'endDate', e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm"/>
                    </div>
                    <div className="relative">
                        <textarea placeholder="Description" value={exp.description} onChange={e => handleNestedChange('experience', exp.id, 'description', e.target.value)} rows={5} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full pr-10"></textarea>
                        <AIGenerateButton isLoading={loadingStates[`exp_desc_${exp.id}`]} onClick={() => runAIGeneration<string>(`exp_desc_${exp.id}`, `For a job title of "${exp.jobTitle}", write 3-5 professional resume bullet points describing key responsibilities and achievements. Use action verbs.`, result => handleNestedChange('experience', exp.id, 'description', result))} />
                    </div>
                </div>
              ))}
            </div>
            {/* Skills */}
            <div className="relative">
              <h2 className="text-xl font-semibold mb-3">Skills</h2>
              <textarea placeholder="Comma separated skills" value={userInfo.skills.join(', ')} onChange={e => handleUserInfoChange('skills', e.target.value.split(',').map(s => s.trim()))} rows={2} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full pr-10"></textarea>
              <AIGenerateButton isLoading={loadingStates['skills']} onClick={() => runAIGeneration<string>('skills', `Based on this resume information: ${JSON.stringify(userInfo.experience)}, suggest a list of 10 relevant skills. Return as a comma-separated list.`, result => handleUserInfoChange('skills', result.split(',').map(s => s.trim())))} />
            </div>
          </div>
        )}

        {activeView === View.CoverLetter && (
            <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Cover Letter Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Company Name" value={coverLetterInfo.companyName} onChange={e => setCoverLetterInfo(p => ({...p, companyName: e.target.value}))} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full" />
                      <input type="text" placeholder="Job Title You're Applying For" value={coverLetterInfo.jobTitle} onChange={e => setCoverLetterInfo(p => ({...p, jobTitle: e.target.value}))} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full" />
                  </div>
                </div>
                <div className="relative">
                    <h2 className="text-xl font-semibold mb-3">Cover Letter Content</h2>
                     <button
                        onClick={() => runAIGeneration<{ text: string; sources: any[] }>(
                            'cover_letter',
                            `Write a professional cover letter for the position of '${coverLetterInfo.jobTitle}' at '${coverLetterInfo.companyName}'. My name is ${userInfo.fullName}. Use my resume for context: ${JSON.stringify(userInfo)}. Use Google Search to find recent news or the mission of '${coverLetterInfo.companyName}' and incorporate it to show genuine interest.`,
                            result => {
                                setCoverLetterInfo(p => ({...p, content: result.text}));
                                setCoverLetterSources(result.sources);
                            },
                            true
                        )}
                        disabled={loadingStates['cover_letter']}
                        className="mb-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        <SparklesIcon className="w-5 h-5"/>
                        {loadingStates['cover_letter'] ? 'Generating...' : 'Generate with AI & Search'}
                    </button>
                    <textarea value={coverLetterInfo.content} onChange={e => setCoverLetterInfo(p => ({...p, content: e.target.value}))} rows={20} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-full"></textarea>
                    {coverLetterSources.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Sources from Google Search:</h3>
                            <ul className="list-disc list-inside text-xs space-y-1">
                                {coverLetterSources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{source.web?.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Right Panel: Preview */}
      <div className="w-1/2 p-6 bg-gray-800 h-full flex flex-col">
        <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Preview</h2>
            <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {isDownloading ? 'Downloading...' : `Download ${activeView}`}
            </button>
        </div>
        <div className="h-full max-h-full overflow-hidden" ref={previewRef}>
            {activeView === View.Resume ? (
                <ResumePreview userInfo={userInfo} />
            ) : (
                <CoverLetterPreview userInfo={userInfo} coverLetterInfo={coverLetterInfo} />
            )}
        </div>
      </div>
    </div>
  );
};