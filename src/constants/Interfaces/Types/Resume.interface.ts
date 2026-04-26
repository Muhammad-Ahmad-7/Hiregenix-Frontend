// ==============================
// Candidate Resume / Profile
// ==============================
export interface CandidateResume {
  _id: string;
  candidateId: string;
  fileUrl: string;
  parsedData: ParsedData;
  aiScore: number;
  aiSuggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeAddDataResponse {
  CandidateResume: CandidateResume;
  parsedData: ParsedData;
}

export interface ParsedData {
  portfolio: string | null;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  link: string | null;
  technologies: string[];
}

export interface Certification {
  _id: string;
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}
