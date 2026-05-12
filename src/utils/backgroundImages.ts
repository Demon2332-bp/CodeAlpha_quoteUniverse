import { imageManifest } from './imageManifest';

export interface BackgroundImage {
  id: string;
  src: string;
  alt: string;
}

// Image manifest is generated from public/images/ at build time.
export const backgroundImages: BackgroundImage[] = imageManifest;

// Function to get a random background image
export const getRandomBackgroundImage = (): BackgroundImage => {
  if (backgroundImages.length === 0) {
    return { id: 'fallback', src: '', alt: 'Fallback Background' };
  }

  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};

// Function to get background image by index (for sequential access if needed)
export const getBackgroundImageByIndex = (index: number): BackgroundImage => {
  if (backgroundImages.length === 0) {
    return { id: 'fallback', src: '', alt: 'Fallback Background' };
  }

  const safeIndex = Math.max(0, Math.min(index, backgroundImages.length - 1));
  return backgroundImages[safeIndex];
};

// Function to add a new background image
export const addBackgroundImage = (image: BackgroundImage): void => {
  backgroundImages.push(image);
};

// Function to remove a background image by id
export const removeBackgroundImage = (id: string): void => {
  const index = backgroundImages.findIndex(img => img.id === id);
  if (index !== -1) {
    backgroundImages.splice(index, 1);
  }
};

// Get total number of background images
export const getTotalBackgroundImages = (): number => {
  return backgroundImages.length;
};