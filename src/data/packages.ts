import type { Pack } from "../types";

export const INTERNET_PACKS: Pack[] = [
  { id: "net10", label: "۱۰" },
  { id: "net20", label: "۲۰" },
  { id: "net50", label: "۵۰" },
  { id: "net100", label: "۱۰۰" },
  { id: "net200", label: "۲۰۰" },
  { id: "net300", label: "۳۰۰" },
];

export const VOICE_PACKS: Pack[] = [
  { id: "v250", label: "۲۵۰ دقیقه" },
  { id: "v500", label: "۵۰۰ دقیقه" },
  { id: "v1000", label: "۱٬۰۰۰ دقیقه" },
  { id: "v2000", label: "۲٬۰۰۰ دقیقه" },
  { id: "v3000", label: "۳٬۰۰۰ دقیقه" },
  { id: "v5000", label: "۵٬۰۰۰ دقیقه" },
];

export const DK_VOUCHERS: Pack[] = [
  { id: "dk1m", label: "۱ میلیون" },
  { id: "dk2m", label: "۲ میلیون" },
  { id: "dk3m", label: "۳ میلیون" },
];

export const FT_VOUCHERS: Pack[] = [
  { id: "ft1m", label: "۱ میلیون" },
  { id: "ft2m", label: "۲ میلیون" },
  { id: "ft3m", label: "۳ میلیون" },
];

// قیمت‌ها (تومان)
export const PRICES = {
  internet: { 
    net10: 40000,
    net20: 80000,
    net50: 200000,
    net100: 400000, 
    net200: 800000, 
    net300: 1200000 
  }, // 4000 تومان به ازای هر گیگ
  voice: { 
    v250: 14750, 
    v500: 29500, 
    v1000: 59000, 
    v2000: 118000, 
    v3000: 177000, 
    v5000: 295000 
  }, // 59 تومان به ازای هر دقیقه
  digikala: { dk1m: 1000000, dk2m: 2000000, dk3m: 3000000 },
  flytoday: { ft1m: 1000000, ft2m: 2000000, ft3m: 3000000 },
} as const;
export const DIGIKALA_VOUCHERS = DK_VOUCHERS;
export const FLYTODAY_VOUCHERS = FT_VOUCHERS;
export const PRICING = PRICES;

// Purchase links for voucher redemption
export const PURCHASE_LINKS = {
  MCI: 'https://mci.ir/',
  DIGIKALA: 'https://www.digikala.com/',
  FLYTODAY: 'https://www.flytoday.ir/'
} as const;
