import { PRICING } from "../data/packages";

// فرمت کردن عدد به صورت فارسی با جداکننده
export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

// محاسبه قیمت کل
export function calculateTotalPrice(
  internet: string | null,
  voice: string | null,
  dkVoucher: string | null,
  ftVoucher: string | null
): number {
  let total = 0;
  if (internet) total += PRICING.internet[internet as keyof typeof PRICING.internet] || 0;
  if (voice) total += PRICING.voice[voice as keyof typeof PRICING.voice] || 0;
  if (dkVoucher) total += PRICING.digikala[dkVoucher as keyof typeof PRICING.digikala] || 0;
  if (ftVoucher) total += PRICING.flytoday[ftVoucher as keyof typeof PRICING.flytoday] || 0;
  return total;
}