// Download utilities for quotes

export interface Quote {
  id: number;
  text: string;
  author: string;
}

// Function to download quote as text
export const downloadQuoteAsText = (quote: Quote): void => {
  const content = `"${quote.text}" - ${quote.author}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `quote-${quote.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Function to download quote as image (with background)
export const downloadQuoteAsImage = async (quote: Quote, backgroundImageSrc?: string): Promise<void> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Set canvas size
  canvas.width = 1200;
  canvas.height = 800;

  // Load background image if provided
  if (backgroundImageSrc) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = backgroundImageSrc;
      });

      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add overlay for text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.warn('Failed to load background image for download:', error);
      // Fallback to gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    // Default gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Add quote text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Quote text
  ctx.font = 'bold 48px Arial, sans-serif';
  const maxWidth = canvas.width - 100;
  const words = quote.text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw quote lines
  const lineHeight = 60;
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  // Add author
  ctx.font = 'italic 32px Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`— ${quote.author}`, canvas.width / 2, startY + lines.length * lineHeight + 60);

  // Add app branding
  ctx.font = '24px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Quote Universe', canvas.width / 2, canvas.height - 50);

  // Download the image
  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quote-${quote.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, 'image/png');
};

// Function to copy quote text to clipboard
export const copyQuoteToClipboard = async (quote: Quote): Promise<boolean> => {
  const text = `"${quote.text}" - ${quote.author}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Failed to copy to clipboard:', error);

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};