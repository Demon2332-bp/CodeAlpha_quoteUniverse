import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ClockProps {
  variant?: 'default' | 'compact';
}

export const DigitalClock: React.FC<ClockProps> = ({ variant = 'default' }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (variant === 'compact') {
    return (
      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
        {time || '00:00:00'}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center py-8"
    >
      <div className="text-center">
        <div className="text-6xl md:text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg">
          {time || '00:00:00'}
        </div>
        <p className="text-sm text-gray-500 mt-2 tracking-widest">DIGITAL CLOCK</p>
      </div>
    </motion.div>
  );
};
