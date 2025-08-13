import React, { useState, useEffect } from 'react';
import { Gift, LogOut, Calendar, User, Phone, Clock, Copy, ExternalLink, Shield, CheckCircle, XCircle, ChevronDown, ChevronUp, Heart, Star, Settings, Save, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { LoadingSpinner } from './common/LoadingSpinner';
import { PersianCalendar } from './PersianCalendar';
import { useUser } from '../contexts/UserContext';
import { PURCHASE_LINKS, OTP_CONFIG } from '../utils/constants';
import { formatPhoneNumber } from '../utils/validation';
import { OCCASIONS } from '../data/occasions';
import type { GiftCard } from '../types';
import type { SavedDate } from '../types/calendar';

type VoucherState = {
  isLoading: boolean;
  showCode: boolean;
  timeLeft: number;
};

type UserProfileProps = {
  onLogout: () => void;
};

export function UserProfile({ onLogout }: UserProfileProps) {
  const { userAccounts, loggedInUser, setLoggedInUser } = useUser();
  const [activeTab, setActiveTab] = useState<'gifts' | 'calendar' | 'profile'>('gifts');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [voucherStates, setVoucherStates] = useState<Record<string, VoucherState>>({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    phone: loggedInUser || '',
    email: '',
    birthDate: '',
    giftPreferences: {
      category: '',
      subcategory: ''
    }
  });
  const [savedDates, setSavedDates] = useState<SavedDate[]>(() => {
    const saved = localStorage.getItem(`savedDates_${loggedInUser}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleLogout = () => {
    setLoggedInUser(null);
    onLogout();
  };

  const currentUser = userAccounts.find(user => user.phone === loggedInUser);

  // Gift preference categories and subcategories
  const giftCategories = {
    travel: {
      label: 'سفر',
      icon: '✈️',
      subcategories: [
        { key: 'domestic', label: 'سفرهای داخلی' },
        { key: 'international', label: 'سفرهای خارجی' },
        { key: 'adventure', label: 'سفرهای ماجراجویی' },
        { key: 'cultural', label: 'سفرهای فرهنگی' }
      ]
    },
    movie: {
      label: 'فیلم',
      icon: '🎬',
      subcategories: [
        { key: 'cinema', label: 'سینما' },
        { key: 'streaming', label: 'پلتفرم‌های آنلاین' },
        { key: 'series', label: 'سریال' },
        { key: 'documentary', label: 'مستند' }
      ]
    },
    music: {
      label: 'موسیقی',
      icon: '🎵',
      subcategories: [
        { key: 'concert', label: 'کنسرت' },
        { key: 'streaming', label: 'پلتفرم‌های موسیقی' },
        { key: 'instrument', label: 'آلات موسیقی' },
        { key: 'vinyl', label: 'صفحه و کالکشن' }
      ]
    },
    sports: {
      label: 'ورزش',
      icon: '⚽',
      subcategories: [
        { key: 'gym', label: 'باشگاه و تناسب اندام' },
        { key: 'equipment', label: 'تجهیزات ورزشی' },
        { key: 'events', label: 'رویدادهای ورزشی' },
        { key: 'outdoor', label: 'ورزش‌های طبیعت' }
      ]
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        nationalId: currentUser.nationalId || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        birthDate: currentUser.birthDate || '',
        giftPreferences: currentUser.giftPreferences || { category: '', subcategory: '' }
      }));
    }
  }, [currentUser]);

  const handleSaveProfile = () => {
    // Update user account with new profile data
    // This would typically be an API call
    console.log('Saving profile:', profileData);
    setIsEditingProfile(false);
    // You can add actual save logic here
  };

  // Save dates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`savedDates_${loggedInUser}`, JSON.stringify(savedDates));
  }, [savedDates]);

  const handleRequestOTP = async (voucherId: string) => {
    setVoucherStates(prev => ({
      ...prev,
      [voucherId]: { ...prev[voucherId], isLoading: true }
    }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setVoucherStates(prev => ({
      ...prev,
      [voucherId]: { 
        ...prev[voucherId], 
        isLoading: false, 
        timeLeft: OTP_CONFIG.EXPIRY_MINUTES * 60,
        showCode: true 
      }
    }));

    // Start countdown timer
    const timer = setInterval(() => {
      setVoucherStates(prev => {
        const currentState = prev[voucherId];
        if (!currentState || currentState.timeLeft <= 1) {
          clearInterval(timer);
          return {
            ...prev,
            [voucherId]: {
              ...currentState,
              showCode: false,
              timeLeft: 0
            }
          };
        }
        return {
          ...prev,
          [voucherId]: {
            ...currentState,
            timeLeft: currentState.timeLeft - 1
          }
        };
      });
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getTestVoucherCode = (type: string, amount: string): string => {
    const codes = {
      internet: {
        '10': 'INT10GB2024TEST',
        '20': 'INT20GB2024TEST',
        '50': 'INT50GB2024TEST',
        '100': 'INT100GB2024TEST'
      },
      voice: {
        '500': 'VOICE500MIN2024',
        '1000': 'VOICE1000MIN2024',
        '2000': 'VOICE2000MIN2024'
      },
      digikala: {
        '500000': 'DK500K2024GIFT',
        '1000000': 'DK1M2024GIFT',
        '2000000': 'DK2M2024GIFT',
        '3000000': 'DK3M2024GIFT'
      },
      flytoday: {
        '1000000': 'FT1M2024TRAVEL',
        '2000000': 'FT2M2024TRAVEL',
        '3000000': 'FT3M2024TRAVEL',
        '5000000': 'FT5M2024TRAVEL'
      }
    };

    const typeAmount = amount.replace(/[^\d]/g, '');
    const codeGroup = codes[type as keyof typeof codes] as Record<string, string> | undefined;
    return codeGroup?.[typeAmount] || `${type.toUpperCase()}${typeAmount}2024`;
  };

  const getPurchaseLink = (type: string): string => {
    switch (type) {
      case 'internet':
      case 'voice':
        return PURCHASE_LINKS.MCI;
      case 'digikala':
        return PURCHASE_LINKS.DIGIKALA;
      case 'flytoday':
        return PURCHASE_LINKS.FLYTODAY;
      default:
        return PURCHASE_LINKS.MCI;
    }
  };

  const getOccasionInfo = (occasionKey: string, customOccasion?: string) => {
    if (occasionKey === 'custom') {
      return {
        label: customOccasion || 'بهانه دلخواه',
        icon: '✨',
        gradient: 'from-zinc-700 to-zinc-500'
      };
    }
    const occasion = OCCASIONS.find(o => o.key === occasionKey);
    return {
      label: occasion?.label || occasionKey,
      icon: occasion?.theme.pattern || '🎁',
      gradient: occasion?.gradient || 'from-blue-500 to-purple-500'
    };
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">کاربر یافت نشد</h2>
          <Button onClick={onLogout} variant="outline" className="rounded-xl">
            بازگشت به صفحه ورود
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">پروفایل کاربری</h1>
                <p className="text-gray-600">{loggedInUser ? formatPhoneNumber(loggedInUser) : ''}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl flex items-center gap-2"
            >
              <LogOut size={18} />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 xl:gap-6">
          {/* Right Sidebar - First in HTML for RTL */}
          <div className="xl:col-span-1 order-1">
            <div className="xl:sticky xl:top-24 space-y-4 xl:space-y-6">
              {/* User Profile Card */}
              <Card className="rounded-2xl xl:rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="text-center pb-3 xl:pb-4 px-4 xl:px-6">
                  <div className="relative">
                    <div className="h-16 w-16 xl:h-20 xl:w-20 rounded-2xl xl:rounded-3xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white mx-auto mb-3 xl:mb-4 shadow-xl">
                      <User size={24} className="xl:hidden" />
                      <User size={28} className="hidden xl:block" />
                      <div className="absolute -bottom-1 -right-1 xl:-bottom-2 xl:-right-2 h-5 w-5 xl:h-6 xl:w-6 bg-green-500 rounded-full border-2 xl:border-4 border-white flex items-center justify-center">
                        <div className="h-1.5 w-1.5 xl:h-2 xl:w-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-base xl:text-lg font-bold text-gray-800 mb-1">
                    {currentUser.name || 'کاربر گرامی'}
                  </CardTitle>
                  <p className="text-gray-500 text-xs xl:text-sm font-medium">
                    {formatPhoneNumber(loggedInUser || '')}
                  </p>
                  <div className="mt-2 xl:mt-3">
                    <span className="inline-flex items-center px-2 xl:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-1.5 h-1.5 xl:w-2 xl:h-2 bg-green-500 rounded-full mr-1 xl:mr-2"></div>
                      آنلاین
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-3 xl:px-6 pb-4 xl:pb-6">
                  <div className="space-y-2 xl:space-y-3">
                    <div className="flex items-center justify-between p-2.5 xl:p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl xl:rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-2 xl:gap-3">
                        <div className="h-7 w-7 xl:h-8 xl:w-8 bg-blue-500 rounded-lg xl:rounded-xl flex items-center justify-center">
                          <Gift size={14} className="xl:hidden text-white" />
                          <Gift size={16} className="hidden xl:block text-white" />
                        </div>
                        <div>
                          <span className="text-xs xl:text-sm font-semibold text-gray-800">کارت‌های دریافتی</span>
                          <div className="text-xs text-gray-600">مجموع هدایا</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-lg xl:text-xl font-bold text-blue-600">{(currentUser.giftCards ?? []).length}</span>
                        <div className="text-xs text-blue-500">عدد</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 xl:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl xl:rounded-2xl border border-green-200">
                      <div className="flex items-center gap-2 xl:gap-3">
                        <div className="h-7 w-7 xl:h-8 xl:w-8 bg-green-500 rounded-lg xl:rounded-xl flex items-center justify-center">
                          <Calendar size={14} className="xl:hidden text-white" />
                          <Calendar size={16} className="hidden xl:block text-white" />
                        </div>
                        <div>
                          <span className="text-xs xl:text-sm font-semibold text-gray-800">تاریخ‌های ذخیره شده</span>
                          <div className="text-xs text-gray-600">یادداشت‌ها</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-lg xl:text-xl font-bold text-green-600">{savedDates.length}</span>
                        <div className="text-xs text-green-500">مورد</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Tabs */}
              <Card className="rounded-2xl xl:rounded-3xl shadow-lg border-0 bg-white">
                <CardHeader className="pb-2 xl:pb-3 px-4 xl:px-6">
                  <CardTitle className="text-sm xl:text-base font-bold text-gray-800 flex items-center gap-2">
                    <div className="h-2 w-2 bg-[#0095da] rounded-full"></div>
                    منوی اصلی
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3 xl:px-6 pb-4 xl:pb-6">
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('gifts')}
                      className={`w-full flex items-center gap-2 xl:gap-3 py-2.5 xl:py-3 px-2.5 xl:px-3 rounded-xl xl:rounded-2xl transition-all duration-200 ${
                        activeTab === 'gifts'
                          ? 'bg-gradient-to-r from-[#0095da] to-[#0085ca] text-white shadow-lg transform scale-[1.02]'
                          : 'text-gray-600 hover:bg-gray-50 hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`h-8 w-8 xl:h-10 xl:w-10 rounded-lg xl:rounded-xl flex items-center justify-center ${
                        activeTab === 'gifts' ? 'bg-white/20' : 'bg-blue-100'
                      }`}>
                        <Gift size={16} className={`xl:hidden ${activeTab === 'gifts' ? 'text-white' : 'text-blue-600'}`} />
                        <Gift size={18} className={`hidden xl:block ${activeTab === 'gifts' ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className={`text-xs xl:text-sm font-semibold ${activeTab === 'gifts' ? 'text-white' : 'text-gray-800'}`}>
                          کارت‌های هدیه
                        </div>
                        <div className={`text-xs ${activeTab === 'gifts' ? 'text-white/80' : 'text-gray-500'}`}>
                          مدیریت هدایا
                        </div>
                      </div>
                      <Badge className={`rounded-full text-xs font-bold min-w-[20px] h-5 xl:h-6 ${
                        activeTab === 'gifts' 
                          ? 'bg-white/20 text-white border border-white/30' 
                          : 'bg-blue-100 text-blue-600 border border-blue-200'
                      }`}>
                        {(currentUser.giftCards ?? []).length}
                      </Badge>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className={`w-full flex items-center gap-2 xl:gap-3 py-2.5 xl:py-3 px-2.5 xl:px-3 rounded-xl xl:rounded-2xl transition-all duration-200 ${
                        activeTab === 'calendar'
                          ? 'bg-gradient-to-r from-[#0095da] to-[#0085ca] text-white shadow-lg transform scale-[1.02]'
                          : 'text-gray-600 hover:bg-gray-50 hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`h-8 w-8 xl:h-10 xl:w-10 rounded-lg xl:rounded-xl flex items-center justify-center ${
                        activeTab === 'calendar' ? 'bg-white/20' : 'bg-green-100'
                      }`}>
                        <Calendar size={16} className={`xl:hidden ${activeTab === 'calendar' ? 'text-white' : 'text-green-600'}`} />
                        <Calendar size={18} className={`hidden xl:block ${activeTab === 'calendar' ? 'text-white' : 'text-green-600'}`} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className={`text-xs xl:text-sm font-semibold ${activeTab === 'calendar' ? 'text-white' : 'text-gray-800'}`}>
                          تقویم
                        </div>
                        <div className={`text-xs ${activeTab === 'calendar' ? 'text-white/80' : 'text-gray-500'}`}>
                          یادداشت‌ها
                        </div>
                      </div>
                      <Badge className={`rounded-full text-xs font-bold min-w-[20px] h-5 xl:h-6 ${
                        activeTab === 'calendar' 
                          ? 'bg-white/20 text-white border border-white/30' 
                          : 'bg-green-100 text-green-600 border border-green-200'
                      }`}>
                        {savedDates.length}
                      </Badge>
                    </button>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center gap-2 xl:gap-3 py-2.5 xl:py-3 px-2.5 xl:px-3 rounded-xl xl:rounded-2xl transition-all duration-200 ${
                        activeTab === 'profile'
                          ? 'bg-gradient-to-r from-[#0095da] to-[#0085ca] text-white shadow-lg transform scale-[1.02]'
                          : 'text-gray-600 hover:bg-gray-50 hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`h-8 w-8 xl:h-10 xl:w-10 rounded-lg xl:rounded-xl flex items-center justify-center ${
                        activeTab === 'profile' ? 'bg-white/20' : 'bg-purple-100'
                      }`}>
                        <Settings size={16} className={`xl:hidden ${activeTab === 'profile' ? 'text-white' : 'text-purple-600'}`} />
                        <Settings size={18} className={`hidden xl:block ${activeTab === 'profile' ? 'text-white' : 'text-purple-600'}`} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className={`text-xs xl:text-sm font-semibold ${activeTab === 'profile' ? 'text-white' : 'text-gray-800'}`}>
                          مشخصات
                        </div>
                        <div className={`text-xs ${activeTab === 'profile' ? 'text-white/80' : 'text-gray-500'}`}>
                          ویرایش پروفایل
                        </div>
                      </div>
                      <Badge className={`rounded-full text-xs font-bold min-w-[20px] h-5 xl:h-6 ${
                        activeTab === 'profile' 
                          ? 'bg-white/20 text-white border border-white/30' 
                          : 'bg-purple-100 text-purple-600 border border-purple-200'
                      }`}>
                        <Edit size={12} />
                      </Badge>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="rounded-2xl xl:rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
                <CardHeader className="px-4 xl:px-6 pb-3 xl:pb-4">
                  <CardTitle className="text-sm xl:text-base font-bold text-gray-800 flex items-center gap-2 xl:gap-3">
                    <div className="h-7 w-7 xl:h-8 xl:w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg xl:rounded-xl flex items-center justify-center">
                      <Star size={14} className="xl:hidden text-white" />
                      <Star size={16} className="hidden xl:block text-white" />
                    </div>
                    <div>
                      <div className="text-xs xl:text-sm">آمار سریع</div>
                      <div className="text-xs font-normal text-gray-500">خلاصه فعالیت‌ها</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 xl:px-6 pb-4 xl:pb-6">
                  <div className="space-y-2 xl:space-y-3">
                    <div className="flex items-center justify-between p-2.5 xl:p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl xl:rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-2 xl:gap-3">
                        <div className="h-6 w-6 xl:h-7 xl:w-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">💰</span>
                        </div>
                        <div>
                          <span className="text-xs xl:text-sm font-semibold text-gray-800">کل ارزش دریافتی</span>
                          <div className="text-xs text-gray-600">مجموع هدایا</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-sm xl:text-base font-bold text-emerald-600">
                          {(currentUser.giftCards ?? [])
                            .reduce((sum: number, gift: any) => sum + (gift.totalValue || gift.totalPrice || 0), 0)
                            .toLocaleString('fa-IR')}
                        </span>
                        <div className="text-xs text-emerald-500">تومان</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 xl:p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl xl:rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-2 xl:gap-3">
                        <div className="h-6 w-6 xl:h-7 xl:w-7 bg-blue-500 rounded-lg flex items-center justify-center">
                          <CheckCircle size={12} className="xl:hidden text-white" />
                          <CheckCircle size={14} className="hidden xl:block text-white" />
                        </div>
                        <div>
                          <span className="text-xs xl:text-sm font-semibold text-gray-800">کارت‌های فعال</span>
                          <div className="text-xs text-gray-600">قابل استفاده</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm xl:text-base font-bold text-blue-600">
                          {(currentUser.giftCards ?? []).filter((gift: any) => gift.status !== 'used').length}
                        </span>
                        <div className="text-xs text-blue-500">عدد</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="rounded-2xl xl:rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
                <CardContent className="p-3 xl:p-4">
                  <div className="space-y-3">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full rounded-xl xl:rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 py-2 xl:py-2.5 text-xs xl:text-sm"
                    >
                      <LogOut size={14} className="xl:hidden ml-2" />
                      <LogOut size={16} className="hidden xl:block ml-2" />
                      خروج از حساب
                    </Button>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-2">نسخه برنامه</div>
                      <Badge variant="outline" className="rounded-full text-xs">
                        v1.0.0 - نمایشی
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-2">
            {activeTab === 'gifts' && (
              <div className="space-y-4">
                <h2 className="text-xl xl:text-2xl font-bold text-gray-800 mb-4 xl:mb-6">کارت‌های هدیه دریافتی</h2>
                
                {(currentUser.giftCards ?? []).length === 0 ? (
                  <Card className="rounded-xl xl:rounded-2xl">
                    <CardContent className="text-center py-8 xl:py-12">
                      <Gift size={48} className="xl:hidden mx-auto mb-4 text-gray-300" />
                      <Gift size={64} className="hidden xl:block mx-auto mb-4 text-gray-300" />
                      <h3 className="text-base xl:text-lg font-semibold text-gray-600 mb-2">هنوز کارت هدیه‌ای دریافت نکرده‌اید</h3>
                      <p className="text-sm xl:text-base text-gray-500">کارت‌های هدیه دریافتی شما در اینجا نمایش داده می‌شود</p>
                    </CardContent>
                  </Card>
                ) : (
                  (currentUser.giftCards ?? []).map((gift: any) => {
                    const safeGift = {
                      ...gift,
                      vouchers: Array.isArray(gift.vouchers) ? gift.vouchers : [],
                      totalValue: gift.totalValue || gift.totalPrice || 0,
                      status: gift.status || 'active',
                      receivedDate: gift.receivedDate || gift.createdAt || new Date().toLocaleDateString('fa-IR'),
                      message: gift.message || 'پیام تبریک'
                    };
                    
                    const occasionInfo = getOccasionInfo(gift.occasion, gift.customOccasion);
                    const isExpanded = expandedCard === gift.id;
                    
                    return (
                      <Card key={gift.id} className="rounded-xl xl:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200">
                        {/* Card Header - Always Visible */}
                        <div 
                          className={`bg-gradient-to-r ${occasionInfo.gradient} p-4 xl:p-6 text-white cursor-pointer`}
                          onClick={() => setExpandedCard(isExpanded ? null : gift.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 xl:gap-4">
                              <div className="text-2xl xl:text-4xl">{occasionInfo.icon}</div>
                              <div>
                                <h3 className="text-base xl:text-xl font-bold mb-1">{occasionInfo.label}</h3>
                                <div className="flex items-center gap-2 xl:gap-4 text-white/90 text-xs xl:text-sm">
                                  <span>از طرف: {gift.senderName || 'نامشخص'}</span>
                                  <span>•</span>
                                  <span>{safeGift.receivedDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-lg xl:text-2xl font-bold">{safeGift.totalValue.toLocaleString('fa-IR')}</div>
                                <div className="text-xs text-white/80">تومان</div>
                              </div>
                              <div className="text-white/70">
                                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Content */}
                        {isExpanded && (
                          <CardContent className="p-4 xl:p-6">
                            {/* Greeting Message */}
                            <div className="mb-4 xl:mb-6">
                              <h4 className="text-sm xl:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Heart size={18} className="text-red-500" />
                                پیام تبریک
                              </h4>
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg xl:rounded-xl p-3 xl:p-4 border border-blue-100">
                                <p className="text-sm xl:text-base text-gray-700 leading-relaxed">
                                  {gift.message || safeGift.message || 'پیام تبریک ارسال شده است'}
                                </p>
                              </div>
                            </div>

                            {/* Vouchers Grid */}
                            <div>
                              <h4 className="text-sm xl:text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Gift size={18} className="text-green-500" />
                                محتویات هدیه ({safeGift.vouchers.length} مورد)
                              </h4>
                              
                              {safeGift.vouchers.length === 0 ? (
                                <div className="text-center py-6 xl:py-8 text-gray-500">
                                  <p className="text-sm xl:text-base">این کارت هدیه شامل بسته‌ای نمی‌باشد</p>
                                </div>
                              ) : (
                                <div className="grid gap-3 xl:gap-4 xl:grid-cols-2">
                                  {safeGift.vouchers.map((voucher: any) => (
                                    <div key={voucher.id} className="border rounded-lg xl:rounded-xl p-3 xl:p-4 bg-white hover:shadow-md transition-shadow">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className={`h-10 w-10 xl:h-12 xl:w-12 rounded-lg xl:rounded-xl flex items-center justify-center text-xl xl:text-2xl ${
                                          voucher.type === 'internet' ? 'bg-blue-100' :
                                          voucher.type === 'voice' ? 'bg-green-100' :
                                          voucher.type === 'digikala' ? 'bg-red-100' :
                                          'bg-purple-100'
                                        }`}>
                                          {voucher.type === 'internet' ? '📶' :
                                           voucher.type === 'voice' ? '📞' :
                                           voucher.type === 'digikala' ? '🛒' : '✈️'}
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-sm xl:text-base font-semibold text-gray-800">
                                            {voucher.type === 'internet' ? 'بسته اینترنت' :
                                             voucher.type === 'voice' ? 'بسته مکالمه' :
                                             voucher.type === 'digikala' ? 'ووچر دیجی‌کالا' :
                                             'ووچر فلای‌تودی'}
                                          </div>
                                          <div className="text-sm text-gray-600">{voucher.amount}</div>
                                        </div>
                                        <Badge className={`rounded-lg xl:rounded-xl text-xs ${
                                          voucher.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                          {voucher.used ? (
                                            <>
                                              <XCircle size={12} className="ml-1" />
                                              استفاده شده
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle size={12} className="ml-1" />
                                              قابل استفاده
                                            </>
                                          )}
                                        </Badge>
                                      </div>

                                      {/* Voucher Code Section */}
                                      {voucherStates[voucher.id]?.showCode ? (
                                        <div className="space-y-3">
                                          <div className="bg-gray-50 rounded-lg p-2.5 xl:p-3 border-2 border-dashed border-gray-300">
                                            <div className="text-xs text-gray-500 mb-1">کد ووچر:</div>
                                            <div className="font-mono text-xs xl:text-sm font-bold text-blue-600">
                                              {getTestVoucherCode(voucher.type, voucher.amount)}
                                            </div>
                                          </div>
                                          
                                          <div className="flex gap-2">
                                            <Button
                                              onClick={() => copyToClipboard(getTestVoucherCode(voucher.type, voucher.amount))}
                                              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                                            >
                                              <Copy size={14} className="ml-1" />
                                              کپی کد
                                            </Button>
                                            <Button
                                              variant="outline"
                                              onClick={() => window.open(getPurchaseLink(voucher.type), '_blank')}
                                              className="rounded-xl"
                                            >
                                              <ExternalLink size={14} />
                                            </Button>
                                          </div>
                                          
                                          <div className="text-xs text-orange-600 text-center flex items-center justify-center gap-1">
                                            <Clock size={12} />
                                            {formatTime(voucherStates[voucher.id]?.timeLeft || 0)} باقی‌مانده
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <Button
                                            onClick={() => handleRequestOTP(voucher.id)}
                                            className="w-full rounded-lg xl:rounded-xl bg-blue-600 hover:bg-blue-700 text-xs xl:text-sm py-2"
                                            disabled={voucher.used || voucherStates[voucher.id]?.isLoading}
                                          >
                                            {voucherStates[voucher.id]?.isLoading ? (
                                              <LoadingSpinner size="sm" color="text-white" className="ml-1" />
                                            ) : (
                                              <Shield size={16} className="ml-1" />
                                            )}
                                            {voucher.used ? 'استفاده شده' : 
                                             voucherStates[voucher.id]?.isLoading ? 'در حال ارسال...' : 'دریافت کد'}
                                          </Button>
                                          
                                          <Button
                                            variant="outline"
                                            onClick={() => window.open(getPurchaseLink(voucher.type), '_blank')}
                                            className="w-full rounded-lg xl:rounded-xl text-xs xl:text-sm py-2"
                                          >
                                            <ExternalLink size={14} className="ml-1" />
                                            {voucher.type === 'internet' ? 'خرید بسته اینترنت' :
                                             voucher.type === 'voice' ? 'خرید بسته مکالمه' :
                                             voucher.type === 'digikala' ? 'خرید از دیجی‌کالا' :
                                             'رزرو سفر'}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4 xl:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl xl:text-2xl font-bold text-gray-800">مشخصات کاربری</h2>
                  <Button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    variant={isEditingProfile ? "solid" : "outline"}
                    className="rounded-xl"
                  >
                    {isEditingProfile ? (
                      <>
                        <Save size={16} className="ml-2" />
                        ذخیره تغییرات
                      </>
                    ) : (
                      <>
                        <Edit size={16} className="ml-2" />
                        ویرایش
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid gap-4 xl:gap-6">
                  {/* Personal Information */}
                  <Card className="rounded-xl xl:rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User size={20} className="text-blue-600" />
                        اطلاعات شخصی
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                          {isEditingProfile ? (
                            <Input
                              value={profileData.firstName}
                              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="نام خود را وارد کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-800">
                              {profileData.firstName || 'وارد نشده'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                          {isEditingProfile ? (
                            <Input
                              value={profileData.lastName}
                              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="نام خانوادگی خود را وارد کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-800">
                              {profileData.lastName || 'وارد نشده'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">شماره ملی</label>
                          {isEditingProfile ? (
                            <Input
                              value={profileData.nationalId}
                              onChange={(e) => setProfileData(prev => ({ ...prev, nationalId: e.target.value }))}
                              placeholder="شماره ملی خود را وارد کنید"
                              className="rounded-xl"
                              maxLength={10}
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-800">
                              {profileData.nationalId || 'وارد نشده'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن موبایل</label>
                          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                            {formatPhoneNumber(profileData.phone)} (غیرقابل تغییر)
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                          {isEditingProfile ? (
                            <Input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="ایمیل خود را وارد کنید"
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-800">
                              {profileData.email || 'وارد نشده'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ تولد</label>
                          {isEditingProfile ? (
                            <Input
                              type="date"
                              value={profileData.birthDate}
                              onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                              className="rounded-xl"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-800">
                              {profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('fa-IR') : 'وارد نشده'}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gift Preferences */}
                  <Card className="rounded-xl xl:rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart size={20} className="text-pink-600" />
                        کادو چی دوست دارم
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">دسته‌بندی علاقه‌مندی</label>
                        {isEditingProfile ? (
                          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                            {Object.entries(giftCategories).map(([key, category]) => (
                              <button
                                key={key}
                                onClick={() => setProfileData(prev => ({
                                  ...prev,
                                  giftPreferences: { ...prev.giftPreferences, category: key, subcategory: '' }
                                }))}
                                className={`p-3 rounded-xl border-2 transition-all ${
                                  profileData.giftPreferences.category === key
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-2xl mb-2">{category.icon}</div>
                                <div className="text-sm font-medium">{category.label}</div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl">
                            {profileData.giftPreferences.category ? (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {giftCategories[profileData.giftPreferences.category as keyof typeof giftCategories]?.icon}
                                </span>
                                <span className="font-medium">
                                  {giftCategories[profileData.giftPreferences.category as keyof typeof giftCategories]?.label}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">انتخاب نشده</span>
                            )}
                          </div>
                        )}
                      </div>

                      {profileData.giftPreferences.category && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">زیردسته</label>
                          {isEditingProfile ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                              {giftCategories[profileData.giftPreferences.category as keyof typeof giftCategories]?.subcategories.map((sub) => (
                                <button
                                  key={sub.key}
                                  onClick={() => setProfileData(prev => ({
                                    ...prev,
                                    giftPreferences: { ...prev.giftPreferences, subcategory: sub.key }
                                  }))}
                                  className={`p-2 rounded-lg border text-sm transition-all ${
                                    profileData.giftPreferences.subcategory === sub.key
                                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  {sub.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-xl">
                              {profileData.giftPreferences.subcategory ? (
                                giftCategories[profileData.giftPreferences.category as keyof typeof giftCategories]?.subcategories
                                  .find(sub => sub.key === profileData.giftPreferences.subcategory)?.label
                              ) : (
                                <span className="text-gray-500">انتخاب نشده</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {isEditingProfile && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveProfile}
                        className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                      >
                        <Save size={16} className="ml-2" />
                        ذخیره تغییرات
                      </Button>
                      <Button
                        onClick={() => setIsEditingProfile(false)}
                        variant="outline"
                        className="flex-1 rounded-xl"
                      >
                        انصراف
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <PersianCalendar
                userPhone={loggedInUser || ''}
                savedDates={savedDates}
                onSaveDates={setSavedDates}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}