// Bot protection utilities

// Track form load time to detect too-fast submissions
let formLoadTime: number = 0;

export const initBotProtection = () => {
  formLoadTime = Date.now();
};

export const getFormLoadTime = () => formLoadTime;

// Check if form was submitted too quickly (less than 3 seconds = likely bot)
export const isSubmissionTooFast = (minSeconds: number = 3): boolean => {
  if (!formLoadTime) return false;
  const timeTaken = (Date.now() - formLoadTime) / 1000;
  return timeTaken < minSeconds;
};

// Honeypot field check - if filled, it's a bot
export const isHoneypotFilled = (value: string): boolean => {
  return value.length > 0;
};

// Check for automated browser characteristics
export const detectBot = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const suspiciousSignals: boolean[] = [
    // Check for webdriver
    !!(navigator as any).webdriver,
    // Check for headless browser
    /HeadlessChrome/.test(navigator.userAgent),
    // Check for phantom
    !!(window as any).phantom,
    // Check for nightmare
    !!(window as any).__nightmare,
    // Check for selenium
    !!(document as any).__selenium_unwrapped,
    !!(document as any).__webdriver_evaluate,
    !!(document as any).__driver_evaluate,
    // Check window dimensions (headless browsers often have 0x0)
    window.outerWidth === 0 && window.outerHeight === 0,
    // Check for missing plugins (common in headless browsers)
    navigator.plugins.length === 0 && !/Mobile|Android/.test(navigator.userAgent),
  ];
  
  return suspiciousSignals.some(signal => signal === true);
};

// Generate a simple challenge token
export const generateChallengeToken = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

// Validate challenge token (must be recent and valid format)
export const validateChallengeToken = (token: string, maxAgeSeconds: number = 300): boolean => {
  if (!token || !token.includes('-')) return false;
  
  const [timestampPart] = token.split('-');
  const timestamp = parseInt(timestampPart, 36);
  const age = (Date.now() - timestamp) / 1000;
  
  return age >= 0 && age <= maxAgeSeconds;
};

// Combined bot check
export const performBotCheck = (honeypotValue: string): { isBot: boolean; reason?: string } => {
  if (isHoneypotFilled(honeypotValue)) {
    return { isBot: true, reason: 'honeypot' };
  }
  
  if (isSubmissionTooFast(2)) {
    return { isBot: true, reason: 'too_fast' };
  }
  
  if (detectBot()) {
    return { isBot: true, reason: 'automated_browser' };
  }
  
  return { isBot: false };
};
