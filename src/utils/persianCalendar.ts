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
    // Convert Gregorian date to Julian day number
    const a = Math.floor((14 - gm) / 12);
    const y = gy - a;
    const m = gm + 12 * a - 3;
    
    const julianDay = gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
    
    // Convert Julian day to Persian date
    const PERSIAN_EPOCH = 1948321; // Julian day number for 1 Farvardin 1
    let daysSinceEpoch = julianDay - PERSIAN_EPOCH;
    
    // Find the year
    let persianYear = 1;
    while (daysSinceEpoch >= (this.isLeapPersianYear(persianYear) ? 366 : 365)) {
      daysSinceEpoch -= this.isLeapPersianYear(persianYear) ? 366 : 365;
      persianYear++;
    }
    
    // Find the month
    let persianMonth = 1;
    while (persianMonth <= 12) {
      let monthDays;
      if (persianMonth <= 6) {
        monthDays = 31;
      } else if (persianMonth <= 11) {
        monthDays = 30;
      } else {
        monthDays = this.isLeapPersianYear(persianYear) ? 30 : 29;
      }
      
      if (daysSinceEpoch < monthDays) {
        break;
      }
      
      daysSinceEpoch -= monthDays;
      persianMonth++;
    }
    
    const persianDay = daysSinceEpoch + 1;
    
    return { year: persianYear, month: persianMonth, day: persianDay };
  }

  private persianToGregorian(jy: number, jm: number, jd: number): Date {
    // Simplified and more accurate Persian to Gregorian conversion
    // Based on the algorithm from Kazimierz M. Borkowski
    
    const PERSIAN_EPOCH = 1948321; // Julian day number for 1 Farvardin 1 (March 22, 622 CE)
    
    // Calculate total days from Persian epoch
    let totalDays = 0;
    
    // Add days for complete years
    for (let year = 1; year < jy; year++) {
      totalDays += this.isLeapPersianYear(year) ? 366 : 365;
    }
    
    // Add days for complete months in current year
    for (let month = 1; month < jm; month++) {
      if (month <= 6) {
        totalDays += 31;
      } else if (month <= 11) {
        totalDays += 30;
      } else {
        totalDays += this.isLeapPersianYear(jy) ? 30 : 29;
      }
    }
    
    // Add remaining days
    totalDays += jd - 1;
    
    // Convert Julian day to Gregorian date
    const julianDay = PERSIAN_EPOCH + totalDays;
    
    // Julian day to Gregorian conversion
    const a = julianDay + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    
    return new Date(year, month - 1, day);
  }

  private isLeapPersianYear(year: number): boolean {
    // Simplified leap year calculation for Persian calendar
    // Based on the 33-year cycle with 8 leap years
    const cycle = year % 128;
    const leapYears = [1, 5, 9, 13, 17, 22, 26, 30, 34, 38, 42, 46, 50, 55, 59, 63, 67, 71, 75, 79, 84, 88, 92, 96, 100, 104, 108, 112, 116, 121, 125];
    return leapYears.includes(cycle);
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