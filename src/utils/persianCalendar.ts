// Persian Calendar Utilities
export class PersianDate {
  private gregorianDate: Date;
  
  constructor(date?: Date | string | number) {
    this.gregorianDate = date ? new Date(date) : new Date();
  }

  // Convert Gregorian to Persian
  toPersian(): { year: number; month: number; day: number } {
    const g = this.gregorianDate;
    const gy = g.getFullYear();
    const gm = g.getMonth() + 1;
    const gd = g.getDate();
    
    return this.gregorianToPersian(gy, gm, gd);
  }

  // Convert Persian to Gregorian
  static fromPersian(year: number, month: number, day: number): Date {
    const persian = new PersianDate();
    return persian.persianToGregorian(year, month, day);
  }

  private gregorianToPersian(gy: number, gm: number, gd: number): { year: number; month: number; day: number } {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    
    let gy2: number;
    let jy: number;
    
    if (gy <= 1600) {
      jy = 0;
      gy2 = gy + 1;
    } else {
      jy = 979;
      gy2 = gy - 1600;
    }
    
    const gy3 = gy2 > 0 ? gy2 : gy2 + 1;
    let days = (365 * gy3) + (Math.floor((gy3 + 3) / 4)) + (Math.floor((gy3 + 99) / 100)) - (Math.floor((gy3 + 399) / 400)) - 80 + gd + (gm < 3 ? 0 : g_d_m[gm - 1]);
    
    if ((gy3 % 4 === 0 && gy3 % 100 !== 0) || (gy3 % 400 === 0)) {
      if (gm > 2) days += 1;
    }
    
    const jy3 = Math.floor(days / 365.2422) + 979;
    days = days - Math.floor((jy3 - 979) * 365.2422);
    
    let jp = 0;
    for (let i = 0; i < 12; i++) {
      const monthDays = i < 6 ? 31 : (i < 11 ? 30 : (this.isLeapPersianYear(jy3) ? 30 : 29));
      if (days <= monthDays) {
        jp = i + 1;
        break;
      }
      days -= monthDays;
    }
    
    return { year: jy3, month: jp, day: Math.floor(days) };
  }

  private persianToGregorian(jy: number, jm: number, jd: number): Date {
    const epyear = jy - 979;
    let epochday = 365 * epyear;
    epochday += Math.floor(epyear / 33) * 8;
    epochday += Math.floor(((epyear % 33) + 3) / 4);
    
    for (let i = 0; i < jm; i++) {
      if (i < 6) epochday += 31;
      else if (i < 11) epochday += 30;
      else epochday += this.isLeapPersianYear(jy) ? 30 : 29;
    }
    
    epochday += jd;
    
    const gregorianEpoch = new Date(622, 2, 22); // March 22, 622 CE
    const result = new Date(gregorianEpoch.getTime() + (epochday - 1) * 24 * 60 * 60 * 1000);
    
    return result;
  }

  private isLeapPersianYear(year: number): boolean {
    const breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ];
    
    const jp = breaks.length;
    let jump = 0;
    for (let j = 1; j < jp; j++) {
      const jm = breaks[j];
      jump = jm - breaks[j - 1];
      if (year < jm) break;
    }
    
    let n = year - breaks[jp - 1];
    if (n < jump) {
      if (jump - n < 6) n = n - jump + ((jump + 4) / 6) * 6;
      const leap = ((n + 1) % 33) % 4;
      if (jump === 33 && leap === 1) return true;
      if (leap === 1) return true;
    }
    
    return false;
  }

  // Format Persian date
  format(format: string = 'YYYY/MM/DD'): string {
    const persian = this.toPersian();
    const monthNames = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    return format
      .replace('YYYY', persian.year.toString())
      .replace('MM', persian.month.toString().padStart(2, '0'))
      .replace('DD', persian.day.toString().padStart(2, '0'))
      .replace('MMMM', monthNames[persian.month - 1]);
  }

  // Get Persian month name
  getMonthName(): string {
    const monthNames = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    const persian = this.toPersian();
    return monthNames[persian.month - 1];
  }

  // Get Persian day names
  static getDayNames(): string[] {
    return ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  }

  // Get day of week in Persian
  getDayName(): string {
    const dayNames = PersianDate.getDayNames();
    return dayNames[this.gregorianDate.getDay()];
  }
}

// Helper functions
export function formatPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

export function getCurrentPersianDate(): { year: number; month: number; day: number } {
  return new PersianDate().toPersian();
}