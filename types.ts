
export interface CourseModule {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

export interface Lesson {
  id: string;
  moduleId: number;
  title: string;
  videoUrl: string;
  description: string;
  thumbnail?: string;
  completed?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  progress: number;
  status: 'active' | 'completed';
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  timestamp: string;
  videoThumbnail?: string;
}

export interface ViralHook {
  hook: string;
  explanation: string;
}

export interface AIData {
  hooks: ViralHook[];
  strategy: string;
}

export interface ScriptData {
  opening: string;
  body: string;
  cta: string;
}

export type AppView = 'landing' | 'platform' | 'admin' | 'admin-login';
