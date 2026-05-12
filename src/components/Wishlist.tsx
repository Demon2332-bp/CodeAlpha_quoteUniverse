import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { WishlistItem } from '../types';
import { getWishlist, removeFromWishlist } from '../utils/localStorageUtils';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setWishlist(getWishlist());
    }
  }, [isOpen]);

  const handleRemove = (quoteId: number) => {
    removeFromWishlist(quoteId);
    setWishlist(getWishlist());
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="text-red-500" size={28} fill="currentColor" />
                <h2 className="text-2xl font-bold text-gray-800">
                  My Wishlist ({wishlist.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="p-6">
              {wishlist.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Heart className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Save your favorite quotes to see them here
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Collapsed View */}
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 line-clamp-2 text-sm">
                            "{item.text}"
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Saved: {formatDate(item.savedAt)}
                          </p>
                        </div>
                        {expandedId === item.id ? (
                          <ChevronUp size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                        )}
                      </button>

                      {/* Expanded View */}
                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50 border-t border-gray-200 px-4 py-4"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt="Quote"
                                className="w-full h-40 object-cover rounded-lg mb-4"
                              />
                            )}
                            <blockquote className="mb-4">
                              <p className="text-gray-800 italic mb-2">"{item.text}"</p>
                              <footer className="text-gray-600 font-semibold">
                                — {item.author}
                              </footer>
                              {item.category && (
                                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  #{item.category}
                                </span>
                              )}
                            </blockquote>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                            >
                              <X size={16} />
                              Remove from Wishlist
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
