export interface PersonalInfo {
  name: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  email: string;
  linkedin: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  achievements: string[];
  relevantCoursework: string[];
  whyChosen: string;
}

export interface MagicQuestions {
  howFoundJob: string;
  whoHiredYou: string;
  whatHiredToDo: string;
  managerDescription: string;
  areasForGrowth: string;
  biggestWin: string;
  toughestChallenge: string;
  whyLeft: string;
}

export interface CareerMove {
  whyMadeMove: string;
  whatLearned: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  magicQuestions: MagicQuestions;
  careerMove: CareerMove;
  accomplishments: string[];
  challenges: string[];
  exceptionalPerformance: string[];
  skills: string[];
  technologies: string[];
}

export interface KeyStory {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  learned: string;
  tags: string[];
}

export interface Award {
  title: string;
  organization: string;
  year: string;
  description: string;
}

export interface CompletionStatus {
  education: boolean;
  experience: boolean;
  stories: boolean;
  questions: boolean;
}

export interface InterviewMetadata {
  lastUpdated: string;
  version: string;
  completionStatus: CompletionStatus;
}

export interface CandidateInfo {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  keyStories: KeyStory[];
  strengths: string[];
  growthAreas: string[];
  awards: Award[];
  questionsForInterviewer: string[];
  interviewMetadata: InterviewMetadata;
}