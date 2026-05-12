import React, { useEffect } from 'react';
import { imageManifest } from '../utils/imageManifest';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  useEffect(() => {
    const handleStart = () => onEnterApp();
    window.addEventListener('keydown', handleStart);
    window.addEventListener('pointerdown', handleStart);

    return () => {
      window.removeEventListener('keydown', handleStart);
      window.removeEventListener('pointerdown', handleStart);
    };
  }, [onEnterApp]);

  const welcomeImages = imageManifest.slice(0, 6);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 opacity-90">
        {welcomeImages.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/20 bg-slate-900/50">
            <img
              src={image.src}
              alt={image.alt}
              className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_25%),_linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(7,10,23,0.96))]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-[0.2em]">
            Quote Universe
          </h1>
          <p className="text-lg md:text-2xl text-white/75 font-light">
            Discover inspiring quotes with beautiful image backgrounds.
          </p>
        </div>

        <div className="max-w-2xl mb-12 rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <blockquote className="text-2xl md:text-3xl text-white font-medium italic leading-relaxed">
            “Dream big. Start small. Act now.”
          </blockquote>
          <cite className="text-base text-white/70 mt-4 block">— Robin Sharma</cite>
        </div>

        <button
          onClick={onEnterApp}
          className="group relative px-10 py-4 bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-fuchsia-500/50"
        >
          <span className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            Enter Quote Universe
          </span>
        </button>

        <p className="text-white/70 text-sm mt-6 max-w-md mx-auto leading-relaxed">
          Press any key or tap anywhere to begin. Start a random quote experience with images and download options.
        </p>
      </div>
    </div>
  );
};