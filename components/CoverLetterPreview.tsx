import React from 'react';
import { UserInfo, CoverLetterInfo } from '../types';

interface CoverLetterPreviewProps {
  userInfo: UserInfo;
  coverLetterInfo: CoverLetterInfo;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ userInfo, coverLetterInfo }) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg h-full overflow-y-auto font-serif">
      <div className="text-sm">
        {/* Sender's Info */}
        <div className="text-right mb-12">
          <h1 className="text-2xl font-bold text-gray-900">{userInfo.fullName}</h1>
          <p>{userInfo.address}</p>
          <p>{userInfo.phone}</p>
          <p>{userInfo.email}</p>
        </div>

        {/* Date */}
        <div className="mb-8">
          <p>{today}</p>
        </div>

        {/* Recipient's Info */}
        <div className="mb-8">
          <h2 className="font-bold">Hiring Manager</h2>
          <p>{coverLetterInfo.companyName}</p>
        </div>
        
        {/* Salutation and Body */}
        <div 
          className="whitespace-pre-wrap leading-relaxed"
          // Using dangerouslySetInnerHTML to render newlines as <br> tags for better PDF rendering
          dangerouslySetInnerHTML={{ __html: coverLetterInfo.content.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  );
};