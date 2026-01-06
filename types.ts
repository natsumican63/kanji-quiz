
export interface Segment {
  k: string; // Kanji
  h: string; // Hiragana
}

export interface QuizItem {
  kanji: string;
  hiragana: string;
  segments: Segment[];
  category: 'PREFECTURE' | 'VEHICLE' | 'ANIMAL' | 'FRUIT';
}

export interface QuizQuestion {
  kanji: string;
  correct: string;
  wrong: string;
  options: string[];
  segments: Segment[];
}

export type QuizState = 'START' | 'QUIZ' | 'RESULT';
export type QuizCategory = 'PREFECTURES' | 'VEHICLES' | 'ANIMALS' | 'FRUITS';
