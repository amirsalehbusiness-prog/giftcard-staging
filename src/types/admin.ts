// Admin Dashboard Types
export type AdminUser = {
  id: string;
  username: string;
  password: string;
  role: 'super_admin' | 'admin' | 'manager' | 'analyst';
  permissions: AdminPermission[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  createdBy: string;
};

export type AdminPermission = 
  | 'users_management'
  | 'analytics_view'
  | 'business_management'
  | 'voucher_management'
  | 'system_settings'
  | 'reports_export'
  | 'admin_users_management';

export type BusinessPartner = {
  id: string;
  name: string;
  website: string;
  logoUrl?: string;
  category: 'telecom' | 'ecommerce' | 'travel' | 'food' | 'entertainment' | 'other';
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    authType: 'api_key' | 'oauth' | 'basic_auth';
    endpoints: {
      vouchers: string;
      validate: string;
      redeem: string;
    };
  };
  voucherTypes: VoucherType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VoucherType = {
  id: string;
  name: string;
  description: string;
  category: string;
  denominations: number[];
  currency: 'IRR' | 'USD';
  validityDays: number;
  isActive: boolean;
};

export type AnalyticsData = {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  salesByDay: { date: string; amount: number; orders: number }[];
  salesByWeek: { week: string; amount: number; orders: number }[];
  salesByMonth: { month: string; amount: number; orders: number }[];
  voucherSales: { voucherType: string; amount: number; count: number }[];
  topBusinessPartners: { name: string; sales: number }[];
  userGrowth: { date: string; newUsers: number; totalUsers: number }[];
};

export type AdminRole = {
  id: string;
  name: string;
  permissions: AdminPermission[];
  description: string;
};

export const ADMIN_ROLES: AdminRole[] = [
  {
    id: 'super_admin',
    name: 'مدیر کل',
    description: 'دسترسی کامل به تمام بخش‌ها',
    permissions: [
      'users_management',
      'analytics_view',
      'business_management',
      'voucher_management',
      'system_settings',
      'reports_export',
      'admin_users_management'
    ]
  },
  {
    id: 'admin',
    name: 'مدیر',
    description: 'دسترسی به مدیریت کاربران و تجارت',
    permissions: [
      'users_management',
      'analytics_view',
      'business_management',
      'voucher_management',
      'reports_export'
    ]
  },
  {
    id: 'manager',
    name: 'مدیر عملیات',
    description: 'دسترسی به مدیریت تجارت و ووچرها',
    permissions: [
      'analytics_view',
      'business_management',
      'voucher_management'
    ]
  },
  {
    id: 'analyst',
    name: 'تحلیلگر',
    description: 'دسترسی فقط به آنالیتیکس و گزارش‌ها',
    permissions: [
      'analytics_view',
      'reports_export'
    ]
  }
];

export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  'users_management': 'مدیریت کاربران',
  'analytics_view': 'مشاهده آنالیتیکس',
  'business_management': 'مدیریت کسب‌وکارها',
  'voucher_management': 'مدیریت ووچرها',
  'system_settings': 'تنظیمات سیستم',
  'reports_export': 'خروجی گزارش‌ها',
  'admin_users_management': 'مدیریت کاربران مدیریتی'
};