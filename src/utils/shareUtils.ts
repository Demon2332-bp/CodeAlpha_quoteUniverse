import type { Quote } from '../types';

export interface ShareOption {
  name: string;
  icon: string;
  action: (quote: Quote) => void;
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

export const generateShareText = (quote: Quote): string => {
  return `"${quote.text}" — ${quote.author}`;
};

export const shareOptions: ShareOption[] = [
  {
    name: 'Copy',
    icon: 'Copy',
    action: (quote: Quote) => {
      copyToClipboard(generateShareText(quote));
    }
  },
  {
    name: 'Twitter',
    icon: 'Twitter',
    action: (quote: Quote) => {
      const text = encodeURIComponent(generateShareText(quote));
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    }
  },
  {
    name: 'Facebook',
    icon: 'Facebook',
    action: (quote: Quote) => {
      const url = encodeURIComponent(window.location.href);
      const quote_text = encodeURIComponent(generateShareText(quote));
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote_text}`, '_blank');
    }
  },
  {
    name: 'LinkedIn',
    icon: 'Linkedin',
    action: (quote: Quote) => {
      const url = encodeURIComponent(window.location.href);
      const quote_text = encodeURIComponent(generateShareText(quote));
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${quote_text}`, '_blank');
    }
  },
  {
    name: 'Email',
    icon: 'Mail',
    action: (quote: Quote) => {
      const subject = 'Check out this quote!';
      const body = `I found this quote and thought you might like it:\n\n${generateShareText(quote)}\n\nVisit Quote Universe to get more!`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  },
  {
    name: 'WhatsApp',
    icon: 'MessageCircle',
    action: (quote: Quote) => {
      const text = encodeURIComponent(generateShareText(quote));
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  }
];
