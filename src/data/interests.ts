import type { InterestCategory } from '../types';

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: 'sports',
    name: 'ورزش',
    icon: '⚽',
    subcategories: [
      { id: 'football', name: 'فوتبال', icon: '⚽' },
      { id: 'basketball', name: 'بسکتبال', icon: '🏀' },
      { id: 'volleyball', name: 'والیبال', icon: '🏐' },
      { id: 'tennis', name: 'تنیس', icon: '🎾' },
      { id: 'swimming', name: 'شنا', icon: '🏊' },
      { id: 'gym', name: 'بدنسازی', icon: '💪' },
      { id: 'running', name: 'دویدن', icon: '🏃' },
      { id: 'cycling', name: 'دوچرخه‌سواری', icon: '🚴' },
      { id: 'martial_arts', name: 'هنرهای رزمی', icon: '🥋' },
      { id: 'chess', name: 'شطرنج', icon: '♟️' }
    ]
  },
  {
    id: 'entertainment',
    name: 'سرگرمی',
    icon: '🎮',
    subcategories: [
      { id: 'video_games', name: 'بازی‌های ویدیویی', icon: '🎮' },
      { id: 'board_games', name: 'بازی‌های فکری', icon: '🎲' },
      { id: 'music', name: 'موسیقی', icon: '🎵' },
      { id: 'reading', name: 'مطالعه', icon: '📚' },
      { id: 'photography', name: 'عکاسی', icon: '📸' },
      { id: 'painting', name: 'نقاشی', icon: '🎨' },
      { id: 'crafts', name: 'صنایع دستی', icon: '🧵' },
      { id: 'gardening', name: 'باغبانی', icon: '🌱' },
      { id: 'cooking', name: 'آشپزی', icon: '👨‍🍳' },
      { id: 'dancing', name: 'رقص', icon: '💃' }
    ]
  },
  {
    id: 'movies_series',
    name: 'فیلم و سریال',
    icon: '🎬',
    subcategories: [
      { id: 'action', name: 'اکشن', icon: '💥' },
      { id: 'comedy', name: 'کمدی', icon: '😂' },
      { id: 'drama', name: 'درام', icon: '🎭' },
      { id: 'horror', name: 'ترسناک', icon: '👻' },
      { id: 'romance', name: 'عاشقانه', icon: '💕' },
      { id: 'sci_fi', name: 'علمی-تخیلی', icon: '🚀' },
      { id: 'documentary', name: 'مستند', icon: '📹' },
      { id: 'animation', name: 'انیمیشن', icon: '🎨' },
      { id: 'iranian_cinema', name: 'سینمای ایران', icon: '🇮🇷' },
      { id: 'series', name: 'سریال‌های خارجی', icon: '📺' }
    ]
  },
  {
    id: 'restaurants',
    name: 'رستوران',
    icon: '🍽️',
    subcategories: [
      { id: 'traditional', name: 'غذای سنتی', icon: '🍲' },
      { id: 'fast_food', name: 'فست فود', icon: '🍔' },
      { id: 'italian', name: 'ایتالیایی', icon: '🍝' },
      { id: 'chinese', name: 'چینی', icon: '🥢' },
      { id: 'seafood', name: 'غذای دریایی', icon: '🦐' },
      { id: 'vegetarian', name: 'گیاهی', icon: '🥗' },
      { id: 'desserts', name: 'دسر و شیرینی', icon: '🍰' },
      { id: 'coffee_shop', name: 'کافه', icon: '☕' },
      { id: 'kebab', name: 'کباب', icon: '🍖' },
      { id: 'pizza', name: 'پیتزا', icon: '🍕' }
    ]
  },
  {
    id: 'travel',
    name: 'سفر و گردشگری',
    icon: '✈️',
    subcategories: [
      { id: 'eco_tourism', name: 'بوم‌گردی', icon: '🏔️' },
      { id: 'domestic_travel', name: 'سفر داخلی', icon: '🏛️' },
      { id: 'international_travel', name: 'سفر خارجی', icon: '🌍' },
      { id: 'beach', name: 'ساحل و دریا', icon: '🏖️' },
      { id: 'mountain', name: 'کوهنوردی', icon: '⛰️' },
      { id: 'desert', name: 'کویر', icon: '🏜️' },
      { id: 'historical', name: 'اماکن تاریخی', icon: '🏺' },
      { id: 'camping', name: 'کمپینگ', icon: '⛺' },
      { id: 'luxury_travel', name: 'سفر لوکس', icon: '🏨' },
      { id: 'adventure', name: 'ماجراجویی', icon: '🧗' }
    ]
  },
  {
    id: 'shopping',
    name: 'خرید',
    icon: '🛍️',
    subcategories: [
      { id: 'fashion', name: 'مد و پوشاک', icon: '👗' },
      { id: 'electronics', name: 'الکترونیک', icon: '📱' },
      { id: 'books', name: 'کتاب', icon: '📖' },
      { id: 'home_decor', name: 'دکوراسیون خانه', icon: '🏠' },
      { id: 'beauty', name: 'آرایشی و بهداشتی', icon: '💄' },
      { id: 'sports_equipment', name: 'تجهیزات ورزشی', icon: '🏋️' },
      { id: 'jewelry', name: 'جواهرات', icon: '💎' },
      { id: 'toys', name: 'اسباب‌بازی', icon: '🧸' },
      { id: 'automotive', name: 'خودرو و موتور', icon: '🚗' },
      { id: 'health', name: 'سلامت و تناسب اندام', icon: '💊' }
    ]
  },
  {
    id: 'technology',
    name: 'فناوری',
    icon: '💻',
    subcategories: [
      { id: 'programming', name: 'برنامه‌نویسی', icon: '👨‍💻' },
      { id: 'ai_ml', name: 'هوش مصنوعی', icon: '🤖' },
      { id: 'mobile_apps', name: 'اپلیکیشن موبایل', icon: '📱' },
      { id: 'web_design', name: 'طراحی وب', icon: '🌐' },
      { id: 'gaming_tech', name: 'فناوری بازی', icon: '🎮' },
      { id: 'blockchain', name: 'بلاک‌چین', icon: '⛓️' },
      { id: 'iot', name: 'اینترنت اشیا', icon: '🔗' },
      { id: 'cybersecurity', name: 'امنیت سایبری', icon: '🔒' },
      { id: 'gadgets', name: 'گجت‌ها', icon: '⌚' },
      { id: 'social_media', name: 'شبکه‌های اجتماعی', icon: '📲' }
    ]
  },
  {
    id: 'education',
    name: 'آموزش',
    icon: '🎓',
    subcategories: [
      { id: 'languages', name: 'یادگیری زبان', icon: '🗣️' },
      { id: 'online_courses', name: 'دوره‌های آنلاین', icon: '💻' },
      { id: 'skill_development', name: 'توسعه مهارت', icon: '📈' },
      { id: 'academic', name: 'تحصیلات آکادمیک', icon: '🏫' },
      { id: 'professional', name: 'آموزش حرفه‌ای', icon: '👔' },
      { id: 'art_classes', name: 'کلاس‌های هنری', icon: '🎨' },
      { id: 'music_lessons', name: 'آموزش موسیقی', icon: '🎼' },
      { id: 'workshops', name: 'کارگاه‌ها', icon: '🔧' },
      { id: 'certifications', name: 'گواهینامه‌ها', icon: '📜' },
      { id: 'self_improvement', name: 'خودسازی', icon: '🌟' }
    ]
  }
];

// Helper functions
export function getCategoryById(categoryId: string): InterestCategory | undefined {
  return INTEREST_CATEGORIES.find(cat => cat.id === categoryId);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): { category: InterestCategory; subcategory: any } | undefined {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  if (!subcategory) return undefined;
  
  return { category, subcategory };
}

export function getUserInterestsSummary(interests: any): string {
  if (!interests?.selectedInterests?.length) return 'علاقمندی‌ای تعریف نشده';
  
  const categories = interests.selectedInterests.map((interest: any) => {
    const category = getCategoryById(interest.categoryId);
    return category?.name || 'نامشخص';
  });
  
  return categories.join('، ');
}