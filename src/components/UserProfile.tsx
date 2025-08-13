import React, { useState, useEffect } from 'react';
import { Gift, LogOut, Calendar, User, Phone, Clock, Copy, ExternalLink, Shield, CheckCircle, XCircle, ChevronDown, ChevronUp, Heart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
  const [activeTab, setActiveTab] = useState<'gifts' | 'calendar'>('gifts');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [voucherStates, setVoucherStates] = useState<Record<string, VoucherState>>({});
  const [savedDates, setSavedDates] = useState<SavedDate[]>(() => {
    const saved = localStorage.getItem(`savedDates_${loggedInUser}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleLogout = () => {
    setLoggedInUser(null);
    onLogout();
  };

  const currentUser = userAccounts.find(user => user.phone === loggedInUser);

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'gifts' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">کارت‌های هدیه دریافتی</h2>
                
                {(currentUser.giftCards ?? []).length === 0 ? (
                  <Card className="rounded-2xl">
                    <CardContent className="text-center py-12">
                      <Gift size={64} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">هنوز کارت هدیه‌ای دریافت نکرده‌اید</h3>
                      <p className="text-gray-500">کارت‌های هدیه دریافتی شما در اینجا نمایش داده می‌شود</p>
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
                      <Card key={gift.id} className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200">
                        {/* Card Header - Always Visible */}
                        <div 
                          className={`bg-gradient-to-r ${occasionInfo.gradient} p-6 text-white cursor-pointer`}
                          onClick={() => setExpandedCard(isExpanded ? null : gift.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{occasionInfo.icon}</div>
                              <div>
                                <h3 className="text-xl font-bold mb-1">{occasionInfo.label}</h3>
                                <div className="flex items-center gap-4 text-white/90 text-sm">
                                  <span>از طرف: {gift.senderName || 'نامشخص'}</span>
                                  <span>•</span>
                                  <span>{safeGift.receivedDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{safeGift.totalValue.toLocaleString('fa-IR')}</div>
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
                          <CardContent className="p-6">
                            {/* Greeting Message */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Heart size={18} className="text-red-500" />
                                پیام تبریک
                              </h4>
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-gray-700 leading-relaxed">{safeGift.message}</p>
                              </div>
                            </div>

                            {/* Vouchers Grid */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Gift size={18} className="text-green-500" />
                                محتویات هدیه ({safeGift.vouchers.length} مورد)
                              </h4>
                              
                              {safeGift.vouchers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <p>این کارت هدیه شامل بسته‌ای نمی‌باشد</p>
                                </div>
                              ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                  {safeGift.vouchers.map((voucher: any) => (
                                    <div key={voucher.id} className="border rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${
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
                                          <div className="font-semibold text-gray-800">
                                            {voucher.type === 'internet' ? 'بسته اینترنت' :
                                             voucher.type === 'voice' ? 'بسته مکالمه' :
                                             voucher.type === 'digikala' ? 'ووچر دیجی‌کالا' :
                                             'ووچر فلای‌تودی'}
                                          </div>
                                          <div className="text-sm text-gray-600">{voucher.amount}</div>
                                        </div>
                                        <Badge className={`rounded-xl text-xs ${
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
                                          <div className="bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-300">
                                            <div className="text-xs text-gray-500 mb-1">کد ووچر:</div>
                                            <div className="font-mono text-sm font-bold text-blue-600">
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
                                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
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
                                            className="w-full rounded-xl"
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

            {activeTab === 'calendar' && (
              <PersianCalendar
                userPhone={loggedInUser || ''}
                savedDates={savedDates}
                onSaveDates={setSavedDates}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* User Profile Card */}
              <Card className="rounded-2xl">
                <CardHeader className="text-center">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white mx-auto mb-4">
                    <User size={32} />
                  </div>
                  <CardTitle className="text-lg">{currentUser.name || 'کاربر'}</CardTitle>
                  <p className="text-gray-600">{formatPhoneNumber(loggedInUser || '')}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <span className="text-sm text-gray-600">کارت‌های دریافتی</span>
                      <span className="font-bold text-blue-600">{(currentUser.giftCards ?? []).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-sm text-gray-600">تاریخ‌های ذخیره شده</span>
                      <span className="font-bold text-green-600">{savedDates.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Tabs */}
              <Card className="rounded-2xl">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('gifts')}
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                        activeTab === 'gifts'
                          ? 'bg-[#0095da] text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Gift size={20} />
                      <span className="font-medium">کارت‌های هدیه</span>
                      <Badge className={`mr-auto rounded-full text-xs ${
                        activeTab === 'gifts' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {(currentUser.giftCards ?? []).length}
                      </Badge>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                        activeTab === 'calendar'
                          ? 'bg-[#0095da] text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Calendar size={20} />
                      <span className="font-medium">تقویم</span>
                      <Badge className={`mr-auto rounded-full text-xs ${
                        activeTab === 'calendar' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'
                      }`}>
                        {savedDates.length}
                      </Badge>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star size={16} />
                    آمار سریع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">کل ارزش دریافتی</span>
                      <span className="font-semibold text-green-600">
                        {(currentUser.giftCards ?? [])
                          .reduce((sum: number, gift: any) => sum + (gift.totalValue || gift.totalPrice || 0), 0)
                          .toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">کارت‌های فعال</span>
                      <span className="font-semibold text-blue-600">
                        {(currentUser.giftCards ?? []).filter((gift: any) => gift.status !== 'used').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}