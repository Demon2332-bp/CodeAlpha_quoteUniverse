import type { WishlistItem, Quote } from '../types';

const WISHLIST_KEY = 'quoteUniverse_wishlist';

export const getWishlist = (): WishlistItem[] => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
};

export const saveToWishlist = (quote: Quote): WishlistItem => {
  const wishlist = getWishlist();
  
  // Check if quote already exists
  const exists = wishlist.some(item => item.id === quote.id);
  if (exists) {
    return wishlist.find(item => item.id === quote.id)!;
  }

  const wishlistItem: WishlistItem = {
    ...quote,
    savedAt: new Date().toISOString()
  };

  wishlist.push(wishlistItem);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  
  return wishlistItem;
};

export const removeFromWishlist = (quoteId: number): void => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.id !== quoteId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
};

export const isInWishlist = (quoteId: number): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === quoteId);
};

export const clearWishlist = (): void => {
  localStorage.removeItem(WISHLIST_KEY);
};
