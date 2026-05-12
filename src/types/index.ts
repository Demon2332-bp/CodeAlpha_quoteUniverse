export interface Quote {
  id: number;
  text: string;
  author: string;
  category?: string;
  image?: string;
}

export interface WishlistItem extends Quote {
  savedAt: string;
}

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeVideoConfig {
  period: TimePeriod;
  hours: [number, number];
  videoUrl: string;
  videoFile: string;
}
