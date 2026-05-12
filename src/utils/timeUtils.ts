import type { TimePeriod, TimeVideoConfig } from '../types';

// Time period configuration
export const timeVideoConfig: TimeVideoConfig[] = [
  {
    period: 'morning',
    hours: [6, 11],
    videoFile: 'morning.mp4',
    videoUrl: '/videos/morning.mp4'
  },
  {
    period: 'afternoon',
    hours: [12, 15],
    videoFile: 'afternoon.mp4',
    videoUrl: '/videos/afternoon.mp4'
  },
  {
    period: 'evening',
    hours: [16, 18],
    videoFile: 'evening.mp4',
    videoUrl: '/videos/evening.mp4'
  },
  {
    period: 'night',
    hours: [19, 5],
    videoFile: 'night.mp4',
    videoUrl: '/videos/night.mp4'
  }
];

export const getCurrentTimePeriod = (): TimePeriod => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 15) return 'afternoon';
  if (hour >= 16 && hour <= 18) return 'evening';
  return 'night';
};

export const getBackgroundVideoUrl = (): string => {
  const period = getCurrentTimePeriod();
  const config = timeVideoConfig.find(config => config.period === period);
  return config?.videoUrl || timeVideoConfig[0].videoUrl;
};

export const getTimePeriodColor = (): string => {
  const period = getCurrentTimePeriod();
  const colors: Record<TimePeriod, string> = {
    morning: 'from-yellow-100 to-orange-100',
    afternoon: 'from-blue-100 to-cyan-100',
    evening: 'from-orange-200 to-red-200',
    night: 'from-slate-900 to-slate-800'
  };
  return colors[period];
};
