
export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  context?: string;
}

export interface QuizPart {
  partTitle: string;
  passage: string; // For Reading: the text. For Listening: the script for TTS.
  type: 'reading' | 'listening';
  questions: Question[];
  audioUrls?: string[]; // Optional: for parts with pre-existing audio files
}

export interface QuizData {
  reading: QuizPart[];
  listening: QuizPart[];
}

export enum QuizState {
  STUDENT_INFO = 'STUDENT_INFO',
  GENERATING = 'GENERATING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface StudentInfo {
  fullName: string;
  studentId: string;
  classCode: string;
}
