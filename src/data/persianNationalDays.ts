// Persian National Days and Important Occasions
export type NationalDay = {
  month: number;
  day: number;
  title: string;
  description: string;
  category: 'national' | 'religious' | 'international' | 'cultural';
};

export const PERSIAN_NATIONAL_DAYS: NationalDay[] = [
  // فروردین
  { month: 1, day: 1, title: 'عید نوروز', description: 'آغاز سال نو شمسی', category: 'national' },
  { month: 1, day: 2, title: 'عید نوروز', description: 'دومین روز سال نو', category: 'national' },
  { month: 1, day: 3, title: 'عید نوروز', description: 'سومین روز سال نو', category: 'national' },
  { month: 1, day: 4, title: 'عید نوروز', description: 'چهارمین روز سال نو', category: 'national' },
  { month: 1, day: 12, title: 'روز جمهوری اسلامی ایران', description: 'روز ملی جمهوری اسلامی', category: 'national' },
  { month: 1, day: 13, title: 'روز طبیعت (سیزده بدر)', description: 'روز طبیعت و سیزده بدر', category: 'national' },
  { month: 1, day: 17, title: 'روز زن', description: 'روز بزرگداشت زن', category: 'cultural' },
  { month: 1, day: 18, title: 'روز ملی فناوری هسته‌ای', description: 'روز فناوری هسته‌ای ایران', category: 'national' },

  // اردیبهشت
  { month: 2, day: 2, title: 'روز ملی خلیج فارس', description: 'روز بزرگداشت خلیج فارس', category: 'national' },
  { month: 2, day: 7, title: 'روز جهانی کتاب', description: 'روز بین‌المللی کتاب', category: 'international' },
  { month: 2, day: 10, title: 'روز ملی فضا', description: 'روز فناوری فضایی ایران', category: 'national' },
  { month: 2, day: 18, title: 'روز بزرگداشت عطار', description: 'روز بزرگداشت عطار نیشابوری', category: 'cultural' },
  { month: 2, day: 25, title: 'روز بزرگداشت فردوسی', description: 'روز بزرگداشت حکیم فردوسی', category: 'cultural' },

  // خرداد
  { month: 3, day: 3, title: 'فتح خرمشهر', description: 'روز فتح خرمشهر', category: 'national' },
  { month: 3, day: 4, title: 'رحلت امام خمینی', description: 'سالگرد رحلت امام خمینی', category: 'religious' },
  { month: 3, day: 5, title: 'قیام 15 خرداد', description: 'سالگرد قیام 15 خرداد', category: 'national' },
  { month: 3, day: 14, title: 'رحلت حضرت خدیجه', description: 'سالگرد رحلت حضرت خدیجه کبری', category: 'religious' },
  { month: 3, day: 20, title: 'روز جهانی مهاجر', description: 'روز بین‌المللی مهاجر', category: 'international' },

  // تیر
  { month: 4, day: 7, title: 'روز قلم', description: 'روز بزرگداشت قلم و نویسندگان', category: 'cultural' },
  { month: 4, day: 13, title: 'روز مبارزه با استکبار جهانی', description: 'روز مبارزه با استکبار', category: 'national' },

  // مرداد
  { month: 5, day: 6, title: 'روز خبرنگار', description: 'روز بزرگداشت خبرنگاران', category: 'cultural' },
  { month: 5, day: 17, title: 'روز مهندس', description: 'روز بزرگداشت مهندسان', category: 'cultural' },

  // شهریور
  { month: 6, day: 8, title: 'روز بزرگداشت مولوی', description: 'روز بزرگداشت مولانا', category: 'cultural' },
  { month: 6, day: 27, title: 'آغاز هفته دفاع مقدس', description: 'آغاز هفته دفاع مقدس', category: 'national' },
  { month: 6, day: 31, title: 'روز جهانی ترجمه', description: 'روز بین‌المللی ترجمه', category: 'international' },

  // مهر
  { month: 7, day: 1, title: 'روز بزرگسالان', description: 'روز بزرگداشت سالمندان', category: 'cultural' },
  { month: 7, day: 2, title: 'روز جهانی معلم', description: 'روز بین‌المللی معلم', category: 'international' },
  { month: 7, day: 8, title: 'روز آتش‌نشان', description: 'روز بزرگداشت آتش‌نشانان', category: 'cultural' },
  { month: 7, day: 13, title: 'روز نیروی هوایی', description: 'روز نیروی هوایی ارتش', category: 'national' },
  { month: 7, day: 20, title: 'روز بزرگداشت حافظ', description: 'روز بزرگداشت حافظ شیرازی', category: 'cultural' },

  // آبان
  { month: 8, day: 4, title: 'روز ملی کارآفرینی', description: 'روز کارآفرینی و نوآوری', category: 'national' },
  { month: 8, day: 13, title: 'روز دانش‌آموز', description: 'روز بزرگداشت دانش‌آموزان', category: 'cultural' },
  { month: 8, day: 19, title: 'روز جهانی کودک', description: 'روز بین‌المللی کودک', category: 'international' },

  // آذر
  { month: 9, day: 1, title: 'روز بزرگداشت ابوعلی سینا', description: 'روز پزشک', category: 'cultural' },
  { month: 9, day: 7, title: 'روز نجوم', description: 'روز بزرگداشت نجوم', category: 'cultural' },
  { month: 9, day: 16, title: 'روز دانشجو', description: 'روز بزرگداشت دانشجویان', category: 'cultural' },

  // دی
  { month: 10, day: 5, title: 'شب یلدا', description: 'شب چله - طولانی‌ترین شب سال', category: 'cultural' },
  { month: 10, day: 11, title: 'روز مادر', description: 'روز بزرگداشت مادران', category: 'cultural' },
  { month: 10, day: 24, title: 'روز جهانی معلولان', description: 'روز بین‌المللی معلولان', category: 'international' },

  // بهمن
  { month: 11, day: 12, title: 'روز پدر', description: 'روز بزرگداشت پدران', category: 'cultural' },
  { month: 11, day: 22, title: 'پیروزی انقلاب اسلامی', description: 'سالگرد پیروزی انقلاب', category: 'national' },

  // اسفند
  { month: 12, day: 15, title: 'روز درختکاری', description: 'روز ملی درختکاری', category: 'national' },
  { month: 12, day: 29, title: 'روز ملی شدن صنعت نفت', description: 'روز ملی شدن نفت ایران', category: 'national' },
];

// Get national days for a specific month
export function getNationalDaysForMonth(month: number): NationalDay[] {
  return PERSIAN_NATIONAL_DAYS.filter(day => day.month === month);
}

// Get national day for a specific date
export function getNationalDay(month: number, day: number): NationalDay | undefined {
  return PERSIAN_NATIONAL_DAYS.find(nationalDay => 
    nationalDay.month === month && nationalDay.day === day
  );
}

// Get category color for national days
export function getNationalDayColor(category: NationalDay['category']): string {
  switch (category) {
    case 'national': return 'text-red-600';
    case 'religious': return 'text-green-600';
    case 'international': return 'text-blue-600';
    case 'cultural': return 'text-purple-600';
    default: return 'text-gray-600';
  }
}