import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Quote } from '../types';
import { generateShareText } from '../utils/shareUtils';

interface QuoteDisplayProps {
  quote: Quote | null;
  isLoading?: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading = false }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [defError, setDefError] = useState<string | null>(null);
  const [defLoading, setDefLoading] = useState(false);
  const [quoteRating, setQuoteRating] = useState<number>(0);

  const storageKey = 'quoteUniverse_ratings';

  useEffect(() => {
    if (!quote) {
      setQuoteRating(0);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setQuoteRating(0);
      return;
    }

    try {
      const ratings = JSON.parse(stored) as Record<string, number>;
      setQuoteRating(ratings[quote.id] || 0);
    } catch {
      setQuoteRating(0);
    }
  }, [quote]);

  const handleRating = (rating: number) => {
    if (!quote) return;

    try {
      const stored = localStorage.getItem(storageKey);
      const ratings = stored ? (JSON.parse(stored) as Record<string, number>) : {};
      ratings[quote.id] = rating;
      localStorage.setItem(storageKey, JSON.stringify(ratings));
      setQuoteRating(rating);
    } catch {
      setQuoteRating(rating);
    }
  };

  const handleShareQuote = async () => {
    if (!quote) return;

    const shareText = generateShareText(quote);
    const shareData = {
      title: 'Quote Universe',
      text: shareText,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or device share failed; fallback below.
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      // eslint-disable-next-line no-alert
      alert('Quote copied to clipboard for sharing.');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Unable to share directly. Please copy the quote manually.');
    }
  };

  const sanitizeWord = (word: string) => {
    return word
      .trim()
      .replace(/’/g, "'")
      .replace(/[^\p{L}'-]+/gu, '')
      .replace(/'s$/i, '')
      .toLowerCase();
  };

  const handleWordClick = async (word: string) => {
    const cleanedWord = sanitizeWord(word);
    if (!cleanedWord) return;

    setSelectedWord(cleanedWord);
    setDefinition(null);
    setDefError(null);
    setDefLoading(true);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanedWord)}`);
      const data = await response.json();

      if (!response.ok || !Array.isArray(data) || data.length === 0) {
        throw new Error('Definition not found');
      }

      const definitions = data.flatMap((entry: any) =>
        Array.isArray(entry.meanings)
          ? entry.meanings.flatMap((meaning: any) => Array.isArray(meaning.definitions) ? meaning.definitions : [])
          : []
      );

      const foundDefinition = definitions
        .map((def: any) => def.definition)
        .filter((def: any) => typeof def === 'string')[0]
        || data[0]?.word;

      if (foundDefinition) {
        setDefinition(foundDefinition);
      } else {
        throw new Error('Meaning unavailable');
      }
    } catch (error) {
      setDefError(`No meaning found for “${cleanedWord}”.`);
    } finally {
      setDefLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-2xl max-w-2xl text-center"
        >
          <p className="text-3xl font-bold text-gray-900">Welcome to Quote Universe</p>
          <p className="mt-4 text-sm text-gray-700">
            Tap the arrow button below to generate your first inspiring quote.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const tokens = quote.text.split(/(\s+|[.,;:!?]+)/g);

  return (
    <motion.div
      key={quote.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Quote Text Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-2xl max-w-2xl"
      >
        <blockquote className="text-center">
          <p className="text-2xl md:text-4xl font-serif italic text-gray-800 mb-6">
            "{
              tokens.map((token, index) => {
                const cleaned = sanitizeWord(token);
                if (!cleaned) {
                  return <span key={index}>{token}</span>;
                }
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleWordClick(token)}
                    className={`inline text-gray-800 underline decoration-slate-400 decoration-dashed underline-offset-4 hover:text-slate-950 hover:no-underline ${selectedWord === sanitizeWord(token) ? 'text-slate-950 font-semibold' : ''}`}
                  >
                    {token}
                  </button>
                );
              })
            }"
          </p>
          <footer className="text-lg text-gray-600 font-semibold">
            — {quote.author}
          </footer>
          {quote.category && (
            <span className="inline-block mt-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              #{quote.category}
            </span>
          )}
          <div className="mt-6 rounded-3xl border border-slate-200/20 bg-slate-100/90 p-4 text-left text-sm text-slate-800">
            <p className="mb-2 font-semibold">Tap any word to know its meaning.</p>
            {defLoading ? (
              <p className="text-slate-600">Looking up meaning for “{selectedWord}”...</p>
            ) : selectedWord ? (
              definition ? (
                <p>
                  <span className="font-semibold">{selectedWord}:</span> {definition}
                </p>
              ) : defError ? (
                <p className="text-red-600">{defError}</p>
              ) : (
                <p className="text-slate-600">Click a word above to view its meaning.</p>
              )
            ) : (
              <p className="text-slate-600">Click a word above to view its meaning.</p>
            )}
          </div>
        </blockquote>
      </motion.div>

      <div className="w-full max-w-3xl rounded-3xl border border-slate-200/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 text-center">
          <p className="text-lg font-semibold text-slate-900">Rate this quote</p>
          <p className="text-sm text-slate-500">Share it to your favorite app or listen to it aloud.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRating(value)}
              className="transition-transform duration-200 hover:-translate-y-1"
              aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                className={value <= quoteRating ? 'text-yellow-400' : 'text-slate-300'}
              />
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          {quoteRating > 0 ? `You rated this quote ${quoteRating}/5` : 'Tap a star to rate this quote.'}
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleShareQuote}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Share this quote
          </button>
        </div>
      </div>
    </motion.div>
  );
};
