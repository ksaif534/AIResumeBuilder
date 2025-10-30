
import { Plan, PlanDetails, UserInfo, CoverLetterInfo } from './types';

export const PRICING_PLANS: PlanDetails[] = [
  {
    name: Plan.Free,
    price: '$0',
    features: [
      'Standard Resume Templates',
      'AI-Powered Suggestions',
      'Cover Letter Generation',
      'Uses Powerful Gemini Pro Model',
    ],
    model: 'gemini-2.5-pro',
    cta: 'Start for Free',
  },
  {
    name: Plan.Basic,
    price: '$20/month',
    features: [
      'Everything in Free',
      'Premium Resume Templates',
      'Advanced AI Analysis',
      'Uses Powerful Gemini Pro Model',
    ],
    model: 'gemini-2.5-pro',
    cta: 'Get Started',
  },
  {
    name: Plan.Pro,
    price: '$50/month',
    features: [
      'Everything in Basic',
      'Priority AI Processing',
      'Multi-language Support',
      'Deep Job Description Analysis',
    ],
    model: 'gemini-2.5-pro',
    cta: 'Go Pro',
  },
];

export const INITIAL_USER_INFO: UserInfo = {
  fullName: 'Your Name',
  email: 'your.email@example.com',
  phone: '(123) 456-7890',
  address: 'Your City, State',
  summary: 'A brief professional summary about yourself. Click the magic wand to generate one with AI!',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description: '- Developed and maintained web applications using React and Node.js.\n- Collaborated with cross-functional teams to deliver high-quality software.',
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      graduationDate: 'Dec 2021',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Gemini API'],
};

export const INITIAL_COVER_LETTER_INFO: CoverLetterInfo = {
  companyName: 'Acme Inc.',
  jobTitle: 'Frontend Developer',
  content: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Frontend Developer position at Acme Inc. With my experience in building modern web applications, I am confident I can contribute to your team...',
};
