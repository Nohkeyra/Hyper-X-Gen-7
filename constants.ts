// ===================== LOCAL STORAGE KEYS =====================
export const LS_KEYS = {
  THEME: 'hyperxgen_theme_v1',
  DRAFT: 'hyperxgen_draft_v1'
} as const;

// ===================== ENVIRONMENT CONSTANTS =====================
export const ENV = {
  // Obtained exclusively from environment variable
  API_KEY: process.env.API_KEY || '',
  API_BASE_URL: 'https://generativelanguage.googleapis.com',
  APP_VERSION: '7.1.0',
  NODE_ENV: 'production'
} as const;

// ===================== API ENDPOINTS =====================
export const API_ENDPOINTS = {
  GEMINI: {
    GENERATE_CONTENT: (model: string) => `/v1beta/models/${model}:generateContent`,
    STREAM_GENERATE_CONTENT: (model: string) => `/v1beta/models/${model}:streamGenerateContent`,
    COUNT_TOKENS: (model: string) => `/v1beta/models/${model}:countTokens`
  },
  BACKEND: {
    UPLOAD_IMAGE: '/api/upload',
    SAVE_PRESET: '/api/presets',
    GET_ARCHIVES: '/api/archives'
  }
} as const;

// ===================== APPLICATION CONSTANTS =====================
export const APP_CONSTANTS = {
  APP_NAME: 'Hyper-X-Gen-7',
  MAX_RECENT_ITEMS: 15,
  MAX_PRESETS: 100,
  MAX_LOG_ENTRIES: 50,
  MAX_FILE_SIZE_MB: 10,
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEFAULT_IMAGE_RESOLUTION: 1024,
  COLOR_PALETTE_SIZE: 8,
  RETRY_ATTEMPTS: 5,
  REQUEST_TIMEOUT_MS: 30000,
  DEBOUNCE_DELAY_MS: 300
} as const;

// ===================== UI CONSTANTS =====================
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 'calc(var(--header-h, 64px))',
  CONTROLS_BAR_HEIGHT: 'calc(var(--app-controls-bar-h, 48px))',
  SIDEBAR_WIDTH: 'var(--sidebar-w, 280px)',
  MODAL_MAX_WIDTH: '800px',
  TRANSITION_DURATION: '200ms',
  BORDER_RADIUS: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  Z_INDEX: {
    base: 0,
    header: 1000,
    modal: 2000,
    toast: 3000,
    tooltip: 4000
  }
} as const;

// ===================== ERROR MESSAGES =====================
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API key is missing. System entering limited functionality mode.',
  API_KEY_INVALID: 'Invalid API key. Please verify your Gemini API access.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Retrying with backoff...',
  QUOTA_EXCEEDED: 'API quota exceeded. Please check your billing.',
  IMAGE_TOO_LARGE: 'Image size exceeds maximum limit.',
  UNSUPPORTED_FORMAT: 'Unsupported image format.',
  GENERATION_FAILED: 'Synthesis failed. Returning free mode fallback.',
  STORAGE_FULL: 'Local storage is full. Some data may not be saved.'
} as const;

// ===================== SUCCESS MESSAGES =====================
export const SUCCESS_MESSAGES = {
  PRESET_SAVED: 'Preset committed to vault successfully.',
  IMAGE_GENERATED: 'Identity synthesized successfully.',
  STYLE_EXTRACTED: 'Style DNA harvested successfully.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  HISTORY_CLEARED: 'History purged successfully.'
} as const;

// ===================== VALIDATION CONSTANTS =====================
export const VALIDATION = {
  PROMPT: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 500
  },
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  BASE64_IMAGE: /^data:image\/(png|jpeg|jpg|webp);base64,/,
  FILENAME: /^[a-zA-Z0-9_-]+$/,
  PRESET_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  }
} as const;

export type LsKeys = typeof LS_KEYS;
export type AppConstants = typeof APP_CONSTANTS;
export type UiConstants = typeof UI_CONSTANTS;
export type ErrorMessages = typeof ERROR_MESSAGES;