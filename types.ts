
export enum Plan {
  Free = 'Free',
  Basic = 'Basic',
  Pro = 'Pro',
}

export interface PlanDetails {
  name: Plan;
  price: string;
  features: string[];
  model: string;
  cta: string;
}

export interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
}

export interface CoverLetterInfo {
  companyName: string;
  jobTitle: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
