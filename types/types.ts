// A single entry for experience-like sections
export interface ExperienceEntry {
  role: string;
  company: string;
  organization?: string;
  dateRange: string;
  responsibilities: string[];
}

// A single entry for education
export interface EducationEntry {
  institution: string;
  degree: string;
  dateRange: string;
  gpa?: string;
}

// A single project entry
export interface ProjectEntry {
    name: string;
    date: string;
    details: string[];
}

// Main CV data structure
export interface CVData {
  personalInfo: {
    name: string;
    title?: string;
    phone: string;
    email: string;
    address: string;
    portfolio: string;
    photoUrl: string;
  };
  summary: string;
  education: EducationEntry[];
  workExperience: ExperienceEntry[];
  organizationalExperience: ExperienceEntry[];
  achievements: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: string[];
  languages: string[];
}


// --- Other types for your project ---
export interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
}
export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}
export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}
export interface Step {
  id: number;
  icon: string;
  title: string;
  description: string;
}