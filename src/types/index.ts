import type { ComponentType } from "react";

// Define Voucher type (replace fields as needed)
export type Voucher = {
  id: string;
  type?: string;
  amount?: string | number;
  used?: boolean;
  value?: string | number; // Keep for backward compatibility
};

export type OccasionItem = { 
  key: string; 
  label: string; 
  icon: ComponentType<any>; 
  gradient: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    pattern: string;
    decorativeElements: ComponentType<any>[];
    message: string;
  };
};

// چیپ ساده برای بسته‌ها (مثل 10/20/50 گیگ یا 250/500 دقیقه…)
export type Pack = {
  id: string;   // مثل "net100" یا "v250" یا "dk1m"
  label: string; // متن برای UI، مثل "۱۰۰" یا "۲۵۰ دقیقه"
};

// ——— پایه و حداقل‌ها برای بیلد ———
export type WizardData = {
  occasion: string | null;
  customOccasion: string;
  recipientName: string;
  recipientPhone: string | null;
  senderPhone: string | null;
  senderName: string;
  message?: string;
  internet: string | null;
  voice: string | null;
  dkVoucher: string | null;
  ftVoucher: string | null;
  oneYear: boolean;
};
export type StepInfo = {
  key: string;   // مثلا "occasion" | "message" | "bundles" | "review"
  title: string; // متن عنوان مرحله برای UI
};


export type UserAccount = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  phone: string;
  password: string;
  email?: string;
  birthDate?: string;
  interests?: UserInterests;
  giftCards: GiftCard[]; // ← اضافه شد
};

export type InterestCategory = {
  id: string;
  name: string;
  icon: string;
  subcategories: InterestSubcategory[];
};

export type InterestSubcategory = {
  id: string;
  name: string;
  icon: string;
};

export type UserInterests = {
  selectedInterests: {
    categoryId: string;
    subcategoryIds: string[];
  }[];
  isPublic: boolean;
  lastUpdated: string;
};
// فقط برای بیلد؛ اگر لازم شد بعداً دقیق‌ترش کن
export type GiftCard = {
  amount: number;
  totalValue: number;
  status: string;
  id: string;
  occasion?: string | null;
  customOccasion?: string;
  recipientName?: string;
  recipientPhone?: string | null;
  senderPhone?: string | null;
  senderName?: string;
  message?: string;
  internet?: string | null;
  voice?: string | null;
  dkVoucher?: string | null;
  ftVoucher?: string | null;
  oneYear?: boolean;
  totalPrice?: number;
  isPaid?: boolean;
  createdAt?: string;
  vouchers: Voucher[]; // ← در 
  };