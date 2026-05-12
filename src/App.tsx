import { useState } from 'react';
import type { Quote } from './types';
import { VideoBackground } from './components/VideoBackground';
import { DigitalClock } from './components/DigitalClock';
import { QuoteDisplay } from './components/QuoteDisplay';
import { ActionButtons } from './components/ActionButtons';
import { LandingPage } from './components/LandingPage';
import { quotesDataset } from './data/quotes';
import { getRandomBackgroundImage, type BackgroundImage } from './utils/backgroundImages';
import './App.css'

function App() {
  const [isOnLandingPage, setIsOnLandingPage] = useState(true);
  const [quotes] = useState<Quote[]>(quotesDataset);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState<BackgroundImage | null>(null);

  const getRandomQuote = (sourceQuotes: Quote[] = quotes) => {
    if (sourceQuotes.length === 0) {
      setCurrentQuote(null);
      setCurrentBackgroundImage(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * sourceQuotes.length);
    setCurrentQuote(sourceQuotes[randomIndex]);
    // Change background image when quote changes
    setCurrentBackgroundImage(getRandomBackgroundImage());
  };


  const handleEnterApp = () => {
    setIsOnLandingPage(false);
    getRandomQuote();
  };

  const now = new Date();
  const today = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleStart = () => {
    getRandomQuote();
  };

  const handleGoBack = () => {
    setIsOnLandingPage(true);
    setCurrentQuote(null);
    setCurrentBackgroundImage(null);
  };


  // Show landing page initially
  if (isOnLandingPage) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  // Main app content
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900/10 to-slate-800/10 overflow-hidden">
      {/* Video Background */}
      <VideoBackground backgroundImage={currentBackgroundImage} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-20 px-4 py-4">
          <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💫</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Quote Universe</h1>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 mt-1">Your daily quote world</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-right text-white/80 backdrop-blur-md md:w-auto w-full">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Today</p>
                <p className="text-sm font-semibold text-white">{today}</p>
              </div>
              <div className="border-t border-white/10 pt-3 w-full md:border-t-0 md:pt-0 md:w-auto md:border-l md:pl-4 md:pt-0 md:border-white/10 md:h-10" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Clock</p>
                <DigitalClock variant="compact" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 hover:bg-white/20 transition-colors"
            >
              ← Back to Landing
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-32">
          <div className="w-full max-w-3xl">
            <QuoteDisplay quote={currentQuote} />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ActionButtons
                quote={currentQuote}
                onStart={handleStart}
                onNext={getRandomQuote}
                onCopied={() => {
                  // You can add additional logic here if needed
                }}
                backgroundImage={currentBackgroundImage}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-16 py-8 text-center text-sm text-white/60 backdrop-blur-md">
          <p>Quote Universe © 2024 • Inspire Yourself Every Day</p>
        </footer>
      </div>

    </div>
  );
}

export default App;

