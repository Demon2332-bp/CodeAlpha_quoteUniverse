import React from 'react';
import { getCurrentTimePeriod } from '../utils/timeUtils';
import type { BackgroundImage } from '../utils/backgroundImages';

interface VideoBackgroundProps {
  backgroundImage?: BackgroundImage | null;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  backgroundImage
}) => {
  const period = getCurrentTimePeriod();

  const imageSrc = backgroundImage?.src || '';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Image Background */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={backgroundImage?.alt || 'Background'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: period === 'night' ? 'brightness(0.4)' : 'brightness(1)'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950" />
      )}

      {/* Overlay for better text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            period === 'morning'
              ? 'rgba(255, 193, 7, 0.1)'
              : period === 'afternoon'
              ? 'rgba(33, 150, 243, 0.1)'
              : period === 'evening'
              ? 'rgba(255, 87, 34, 0.1)'
              : 'rgba(0, 0, 0, 0.3)'
        }}
      />
    </div>
  );
};
