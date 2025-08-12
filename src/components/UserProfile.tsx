import React, { useState, useEffect } from 'react';
import { Gift, LogOut, Calendar, User, Phone, Clock, Copy, ExternalLink, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LoadingSpinner } from './common/LoadingSpinner';
import { PersianCalendar } from './PersianCalendar';
import { useUser } from '../contexts/UserContext';
import { PURCHASE_LINKS, OTP_CONFIG } from '../utils/constants';
import { formatPhoneNumber } from '../utils/validation';
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
        <div className="max-w-6xl mx-auto px-4 py-4">
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'gifts'
                ? 'bg-[#0095da] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Gift size={20} />
            کارت‌های هدیه
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'calendar'
                ? 'bg-[#0095da] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={20} />
            تقویم
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'gifts' && (
  <div className="grid gap-6">
    {(currentUser.giftCards ?? []).map((gift: any) => (
      <Card key={gift.id} className="rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{gift.occasion}</CardTitle>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>فرستنده: {gift.senderName}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Phone size={16} className="text-gray-600" />
                            <span className="text-sm text-gray-600">
                              گیرنده: {gift.recipientName} ({gift.recipientPhone || loggedInUser})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={16} className="text-gray-600" />
                            <span>تاریخ دریافت: {gift.receivedDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`rounded-xl ${
                          gift.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : gift.status === 'used'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {gift.status === 'active' ? 'فعال' : gift.status === 'used' ? 'استفاده شده' : 'منقضی'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Message */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <p className="text-gray-700 leading-relaxed">{gift.message}</p>
                    </div>

                    {/* Total Value */}
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-[#0095da] mb-1">
                        {gift.totalValue.toLocaleString('fa-IR')} تومان
                      </div>
                      <div className="text-sm text-gray-600">ارزش کل هدیه</div>
                    </div>

                    {/* Vouchers */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {gift.vouchers.map((voucher: any) => (
                        <div key={voucher.id} className="border rounded-xl p-4 bg-white">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
                              voucher.type === 'internet' ? 'bg-blue-100' :
                              voucher.type === 'voice' ? 'bg-green-100' :
                              voucher.type === 'digikala' ? 'bg-red-100' :
                              'bg-purple-100'
                            }`}>
                              {voucher.type === 'internet' ? '📶' :
                               voucher.type === 'voice' ? '📞' :
                               voucher.type === 'digikala' ? '🛒' : '✈️'}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {voucher.type === 'internet' ? 'بسته اینترنت' :
                                 voucher.type === 'voice' ? 'بسته مکالمه' :
                                 voucher.type === 'digikala' ? 'ووچر دیجی‌کالا' :
                                 'ووچر فلای‌تودی'}
                              </div>
                              <div className="text-sm text-gray-600">{voucher.amount}</div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="mb-3">
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
                  </CardContent>
                </Card>
              ))}
              
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
  );
}