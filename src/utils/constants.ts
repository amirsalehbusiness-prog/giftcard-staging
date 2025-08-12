// Application constants
export const APP_CONFIG = {
  NAME: 'هدیه همراه',
  COMPANY: 'همراه اول',
  VERSION: 'نسخه نمایشی',
  COLORS: {
    PRIMARY: '#0095da',
    SECONDARY: '#ff4f00',
    SUCCESS: '#10b981',
    ERROR: '#ef4444',
    WARNING: '#f59e0b'
  }
} as const;

export const STORAGE_KEYS = {
  USER_ACCOUNTS: 'userAccounts',
  LOGGED_IN_USER: 'loggedInUser',
  SAVED_DATES: 'savedDates'
} as const;

export const ROUTES = {
  HOME: 'home',
  LOGIN: 'login',
  PROFILE: 'profile'
} as const;

export const OTP_CONFIG = {
  EXPIRY_MINUTES: 5,
  CODE_LENGTH: 6
} as const;

export const PURCHASE_LINKS = {
  MCI: 'https://mci.ir/',
  DIGIKALA: 'https://www.digikala.com/',
  FLYTODAY: 'https://www.flytoday.ir/'
} as const;