export interface Job_Interface {
  _id: string;
  companyId: string;

  title: string;
  role: string;
  interviewGuideline: string;
  experienceLevel: "junior" | "mid" | "senior" | string;

  description: string;

  requiredSkills: string[];
  requirements: string[];

  workMode: "remote" | "onsite" | "hybrid" | string;

  location: {
    city: string;
    country: string;
  };

  salaryRange: {
    min: number;
    max: number;
    currency: string; // e.g. 'PKR'
  };

  deadline: string; // ISO date string
  aiSummary: string;

  embeddingSynced: boolean;
  qdrantId: string | null;

  isDeleted: boolean;
  status: "open" | "closed" | string;

  createdAt: string;
  updatedAt: string;
  __v: number;
}
