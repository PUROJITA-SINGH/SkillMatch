export interface User {
  name: string;
  email: string;
}

export interface Resume {
  id: string;
  fileName: string;
  text: string;
  uploadedAt: Date;
}

export interface JobMatchResult {
  matchScore: number;
  matchSummary: string;
  strengths: string[];
  skillGaps: string[];
  transferableSkills: string[];
  atsKeywords: string[];
  improvementSuggestions: string;
}

export interface ResumeTailorResult {
  tailoredResumeText: string;
  changeSummary: string[];
}

export interface LearningResource {
  title: string;
  url: string;
}

export interface GroundingSource {
    title: string;
    uri: string;
}

export interface MarketAnalysisResult {
    summary: string;
    topSkills: string[];
    emergingSkills: string[];
    commonTools: string[];
    sources: GroundingSource[];
}
