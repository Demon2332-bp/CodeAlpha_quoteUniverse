import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ChevronRight, Download, FileText, Volume2, Share2, Link, Mail, MessageCircle } from 'lucide-react';
import type { Quote } from '../types';
import { copyQuoteToClipboard } from '../utils/downloadUtils';
import { downloadQuoteAsImage, downloadQuoteAsText } from '../utils/downloadUtils';
import { shareOptions } from '../utils/shareUtils';
import type { BackgroundImage } from '../utils/backgroundImages';

interface ActionButtonsProps {
  quote: Quote | null;
  onNext: () => void;
  onStart?: () => void;
  onCopied?: () => void;
  backgroundImage?: BackgroundImage | null;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ quote, onNext, onStart, onCopied, backgroundImage }) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  if (!quote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center gap-4 w-full max-w-2xl"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart ?? onNext}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-3xl font-semibold transition-colors"
        >
          <ChevronRight size={20} />
          <span>Start Quote</span>
        </motion.button>
      </motion.div>
    );
  }

  const handleCopy = async () => {
    const success = await copyQuoteToClipboard(quote);
    if (success) {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
      onCopied?.();
    }
  };

  const handleDownloadImage = () => {
    if (!quote) return;
    downloadQuoteAsImage(quote, backgroundImage?.src);
    setShowDownloadMenu(false);
  };

  const handleDownloadText = () => {
    if (!quote) return;
    downloadQuoteAsText(quote);
    setShowDownloadMenu(false);
  };

  const handleCopyText = async () => {
    if (!quote) return;
    const success = await copyQuoteToClipboard(quote);
    if (success) {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
      onCopied?.();
    }
    setShowDownloadMenu(false);
  };

  const handleShareOption = async (action: (quote: Quote) => void | Promise<void>) => {
    if (!quote) return;
    await action(quote);
    setShowShareMenu(false);
    setShowDownloadMenu(false);
  };

  const handleNarrate = () => {
    if (!quote) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${quote.text} — ${quote.author}`);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col gap-4 w-full max-w-2xl"
    >
      {/* Copy Notification */}
      <AnimatePresence>
        {showCopiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/90 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            ✓ Quote copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-5 gap-3">
        {/* Copy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          <Copy size={18} />
          <span className="hidden md:inline">Copy</span>
        </motion.button>

        {/* Download Button */}
        <motion.div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Download size={18} />
            <span className="hidden md:inline">Download</span>
          </motion.button>

          {/* Download Menu */}
          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 overflow-hidden min-w-[200px]"
              >
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={handleDownloadImage}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  Download with Image
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleDownloadText}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <FileText size={18} />
                  Download as Text
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={handleCopyText}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Copy size={18} />
                  Copy Text
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Share Button */}
        <motion.div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowShareMenu(!showShareMenu);
              setShowDownloadMenu(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Share2 size={18} />
            <span className="hidden md:inline">Share</span>
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 overflow-hidden min-w-[220px]"
              >
                {shareOptions.map((option) => {
                  const iconMap: Record<string, React.ElementType> = {
                    Copy,
                    Twitter: Link,
                    Facebook: Link,
                    Linkedin: Link,
                    Email: Mail,
                    WhatsApp: MessageCircle
                  };

                  const Icon = iconMap[option.icon] ?? Link;

                  return (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      onClick={() => void handleShareOption(option.action)}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <Icon size={18} />
                      {option.name}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Narrate Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNarrate}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-semibold transition-colors"
        >
          <Volume2 size={18} />
          <span className="hidden md:inline">Narrate</span>
        </motion.button>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
        >
          <ChevronRight size={18} />
          <span className="hidden md:inline">Next</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
