export type ViewState = 'dashboard' | 'assessment' | 'tutor';

export interface Student {
  id: number;
  name: string;
  grade: string;
  school: string;
}

export interface CompetencyScore {
  subject: string;
  score: number; // 0-100
  delta: number; // change from last week
}

export interface Question {
  id: number;
  subject: 'Maths' | 'Physique' | 'SVT' | 'Français';
  content: string;
  options: string[];
  correctIndex: number;
  difficulty: number; // -3 to 3 (IRT)
  explanation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}
