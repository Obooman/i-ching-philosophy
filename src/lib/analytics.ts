// Analytics configuration
export const GA_ID = import.meta.env.VITE_GA_ID || '';

// Analytics utilities
export const trackEvent = (eventName: string, params: any = {}) => {
  if (typeof window !== 'undefined' && window.GA_ID && typeof gtag !== 'undefined') {
    gtag('event', eventName, params);
  }
};

export const trackPageView = (path: string, title: string) => {
  if (typeof window !== 'undefined' && window.GA_ID && typeof gtag !== 'undefined') {
    gtag('config', window.GA_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

export const isAnalyticsEnabled = () => {
  return typeof window !== 'undefined' && Boolean(window.GA_ID);
};