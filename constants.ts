
// ===================== ENVIRONMENT SANITIZATION =====================
const sanitizeEnv = (val: any): string => {
  if (val === undefined || val === null) return '';
  const s = String(val).replace(/['"]/g, '').trim();
  if (s === 'undefined' || s === 'null' || s === '') return '';
  return s;
};

// ===================== CORE ENVIRONMENT RESOLUTION =====================
/**
 * OMEGA_DETECTION_PROTOCOL: 
 * Using direct literals to ensure Vite static replacement engine triggers.
 */
const V_GEMINI_KEY = process.env.API_KEY || '';
const V_HF_KEY     = process.env.HF_TOKEN || '';
const V_MODEL_ID   = process.env.MODEL_ID || 'black-forest-labs/FLUX.1-schnell';

export const ENV = {
  API_KEY:      sanitizeEnv(V_GEMINI_KEY),
  HF_TOKEN:     sanitizeEnv(V_HF_KEY),
  HF_MODEL:     sanitizeEnv(V_MODEL_ID),
  API_BASE_URL: 'https://generativelanguage.googleapis.com',
  APP_VERSION:  '7.6.1',
  NODE_ENV:     'production',
} as const;

// ===================== LOCAL STORAGE KEYS =====================
export const LS_KEYS = {
  THEME: 'hyperxgen_theme_v1',
  DRAFT: 'hyperxgen_draft_v1',
} as const;

// ===================== API ENDPOINTS =====================
export const API_ENDPOINTS = {
  GEMINI: {
    GENERATE_CONTENT: (model: string) => `/v1beta/models/${model}:generateContent`,
  },
  HF: {
    MODEL_URL: `https://api-inference.huggingface.co/models/${ENV.HF_MODEL}`,
  },
} as const;

// ===================== APPLICATION CONSTANTS =====================
export const APP_CONSTANTS = {
  APP_NAME:           'Hyper-X-Gen-7',
  MAX_RECENT_ITEMS:   15,
  MAX_PRESETS:        100,
  MAX_LOG_ENTRIES:    50,
  RETRY_ATTEMPTS:     3,
  REQUEST_TIMEOUT_MS: 30000,
  DEBOUNCE_DELAY_MS:  300,
} as const;

export const UI_CONSTANTS = {
  HEADER_HEIGHT:       'calc(var(--header-h, 64px))',
  CONTROLS_BAR_HEIGHT: 'calc(var(--app-controls-bar-h, 48px))',
  SIDEBAR_WIDTH:       'var(--sidebar-w, 280px)',
} as const;

export const ERROR_MESSAGES = {
  QUOTA_EXHAUSTED: 'Synthesis limit reached. Transitioning to fallback kernel...',
  PROVIDER_FAILURE: 'Hugging Face Inference Error. Verify your HF_TOKEN in environment.',
  INVALID_KEY:      'Authentication Drift: API key handshake failed.',
} as const;

export const SUCCESS_MESSAGES = {
  IMAGE_GENERATED: 'Identity synthesized successfully.',
  HISTORY_CLEARED: 'Session buffer purged.',
  VAULT_CLEARED:   'Archives deep-cleaned.',
} as const;
