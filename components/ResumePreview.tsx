
import React from 'react';
import { UserInfo } from '../types';

interface ResumePreviewProps {
  userInfo: UserInfo;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold uppercase text-indigo-300 border-b-2 border-indigo-300 pb-1 mb-2">{title}</h2>
    {children}
  </div>
);

export const ResumePreview: React.FC<ResumePreviewProps> = ({ userInfo }) => {
  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg h-full overflow-y-auto">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">{userInfo.fullName}</h1>
        <div className="text-xs text-gray-600 flex justify-center items-center space-x-3 mt-1">
          <span>{userInfo.email}</span>
          <span>&bull;</span>
          <span>{userInfo.phone}</span>
          <span>&bull;</span>
          <span>{userInfo.address}</span>
        </div>
      </header>

      <Section title="Professional Summary">
        <p className="text-xs">{userInfo.summary}</p>
      </Section>

      <Section title="Work Experience">
        {userInfo.experience.map((exp, index) => (
          <div key={exp.id} className={index < userInfo.experience.length - 1 ? 'mb-3' : ''}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-sm font-semibold">{exp.jobTitle}</h3>
              <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</div>
            </div>
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-sm italic">{exp.company}</p>
              <p className="text-xs text-gray-600">{exp.location}</p>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1">
              {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Education">
        {userInfo.education.map((edu, index) => (
          <div key={edu.id} className={index < userInfo.education.length - 1 ? 'mb-2' : ''}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-sm font-semibold">{edu.school}</h3>
              <p className="text-xs text-gray-600">{edu.graduationDate}</p>
            </div>
            <p className="text-sm italic">{edu.degree} in {edu.fieldOfStudy}</p>
          </div>
        ))}
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {userInfo.skills.map(skill => (
            <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
          ))}
        </div>
      </Section>
    </div>
  );
};
