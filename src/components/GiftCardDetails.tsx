import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Clock, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Wifi,
  Phone,
  ShoppingBag,
  Plane,
  Calendar,
  MessageSquare,
  Star,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { OCCASIONS } from '../data/occasions';
import { INTERNET_PACKS, VOICE_PACKS, DIGIKALA_VOUCHERS, FLYTODAY_VOUCHERS, PURCHASE_LINKS } from '../data/packages';
import { formatPrice } from '../utils/pricing';
import { PersianDate, formatPersianNumber } from '../utils/persianCalendar';
import type { GiftCard, OccasionItem } from '../types';

type GiftCardDetailsProps = {
  giftCard: GiftCard;
  onUseVoucher?: (voucherId: string) => void;
};

export function GiftCardDetails({ giftCard, onUseVoucher }: GiftCardDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);
  const [voucherVisibility, setVoucherVisibility] = useState<Record<string, boolean>>({});

  const selectedOccasion: OccasionItem = OCCASIONS.find((o) => o.key === giftCard.occasion) || OCCASIONS[0];

  // Timer for voucher visibility (5 minutes)
  useEffect(() => {
    if (showVouchers && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setShowVouchers(false);
            setVoucherVisibility({});
            return 300; // Reset to 5 minutes
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showVouchers, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyVoucher = async (voucherId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedVoucher(voucherId);
      setTimeout(() => setCopiedVoucher(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleVoucherVisibility = (voucherId: string) => {
    setVoucherVisibility(prev => ({
      ...prev,
      [voucherId]: !prev[voucherId]
    }));
  };

  const getVoucherIcon = (type: string) => {
    switch (type) {
      case 'internet': return <Wifi size={16} />;
      case 'voice': return <Phone size={16} />;
      case 'digikala': return <ShoppingBag size={16} />;
      case 'flytoday': return <Plane size={16} />;
      default: return <Gift size={16} />;
    }
  };

  const getVoucherLink = (type: string) => {
    switch (type) {
      case 'internet':
      case 'voice':
        return PURCHASE_LINKS.MCI;
      case 'digikala':
        return PURCHASE_LINKS.DIGIKALA;
      case 'flytoday':
        return PURCHASE_LINKS.FLYTODAY;
      default:
        return '#';
    }
  };

  const getOccasionLabel = (occasion: string) => {
    if (occasion === 'custom') return giftCard.customOccasion || 'بهانه دلخواه';
    const found = OCCASIONS.find(o => o.key === occasion);
    return found ? found.label : occasion;
  };

  const formatPersianDate = (dateString?: string) => {
    if (!dateString) return 'نامشخص';
    try {
      const date = new Date(dateString);
      const persianDate = new PersianDate(date);
      const formatted = persianDate.format('DD MMMM YYYY');
      // Convert numbers to Persian
      return formatted.replace(/\d/g, (digit) => formatPersianNumber(parseInt(digit)).toString());
    } catch (error) {
      return 'نامشخص';
    }
  };

  return (
    <Card 
      className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-2"
      style={{ 
        borderColor: selectedOccasion.theme.primary + '20',
        background: `linear-gradient(135deg, ${selectedOccasion.theme.primary}05, ${selectedOccasion.theme.secondary}05)`
      }}
    >
      <CardContent className="p-0" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div 
          className="p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${selectedOccasion.theme.primary}, ${selectedOccasion.theme.secondary})`
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10" style={{ borderRadius: '24px' }}>
            <div className="absolute top-4 right-4 text-4xl">{selectedOccasion.theme.pattern}</div>
            <div className="absolute bottom-4 left-4 text-3xl rotate-12">{selectedOccasion.theme.pattern}</div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">
                  {getOccasionLabel(giftCard.occasion || '')}
                </h3>
                <p className="text-white/80 text-sm">
                  از طرف: {giftCard.senderName || 'نامشخص'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Gift size={24} />
                </div>
                <Badge 
                  className={`rounded-xl text-white border-white/30 ${
                    giftCard.status === 'active' ? 'bg-[#439C55]' : 
                    giftCard.status === 'used' ? 'bg-gray-500' :
                    giftCard.status === 'expired' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                >
                  {giftCard.status === 'active' ? 'فعال' :
                   giftCard.status === 'used' ? 'استفاده شده' :
                   giftCard.status === 'expired' ? 'منقضی' : 'نامشخص'}
                </Badge>
              </div>
            </div>

            {giftCard.totalValue && (
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatPrice(giftCard.totalValue)} تومان
                  </div>
                  <div className="text-white/80 text-sm">ارزش کل هدیه</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Recipient Info */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">گیرنده</div>
            <div className="font-semibold text-gray-800">{giftCard.recipientName || 'نامشخص'}</div>
            {giftCard.recipientPhone && (
              <div className="text-sm text-gray-600">{giftCard.recipientPhone}</div>
            )}
          </div>

          {/* Message */}
          {giftCard.message && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">پیام تبریک</span>
              </div>
              <div 
                className="p-3 rounded-xl text-sm leading-6 border"
                style={{ 
                  backgroundColor: selectedOccasion.theme.primary + '08',
                  borderColor: selectedOccasion.theme.primary + '20'
                }}
              >
                {giftCard.message}
              </div>
            </div>
          )}

          {/* Validity */}
          {giftCard.oneYear && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">اعتبار</span>
              </div>
              <Badge 
                className="rounded-xl"
                style={{ 
                  backgroundColor: selectedOccasion.theme.primary + '15',
                  color: selectedOccasion.theme.primary
                }}
              >
                یک سال از تاریخ دریافت
              </Badge>
            </div>
          )}

          {/* Vouchers Summary */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">محتویات هدیه</span>
              </div>
              <Badge variant="secondary" className="rounded-xl">
                {giftCard.vouchers?.length || 0} آیتم
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(giftCard.vouchers) ? giftCard.vouchers : []).map((voucher, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  {getVoucherIcon(voucher.type || '')}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">
                      {voucher.amount}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {voucher.type}
                    </div>
                  </div>
                  <Badge 
                    variant={voucher.used ? 'secondary' : 'solid'} 
                    className={`text-xs ${voucher.used ? '' : 'bg-[#439C55] hover:bg-[#3a8549]'}`}
                  >
                    {voucher.used ? 'استفاده شده' : 'فعال'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              <span className="mr-2">
                {isExpanded ? 'بستن جزئیات' : 'مشاهده جزئیات'}
              </span>
            </Button>
            
            <Button
              onClick={() => setShowVouchers(!showVouchers)}
              className="flex-1 rounded-xl"
              style={{ backgroundColor: selectedOccasion.theme.primary }}
              disabled={giftCard.status !== 'active'}
            >
              <Eye size={18} className="ml-2" />
              مشاهده ووچرها
            </Button>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4" dir="rtl">
              <div className="grid grid-cols-2 gap-4 text-sm" dir="rtl">
                <div>
                  <span className="text-gray-600">تاریخ دریافت:</span>
                  <div className="font-medium">{formatPersianDate(giftCard.createdAt)}</div>
                </div>
                <div>
                  <span className="text-gray-600">وضعیت:</span>
                  <div className="font-medium">
                    {giftCard.status === 'active' ? 'فعال و قابل استفاده' :
                     giftCard.status === 'used' ? 'استفاده شده' :
                     giftCard.status === 'expired' ? 'منقضی شده' : 'نامشخص'}
                  </div>
                </div>
              </div>

              {/* Website Links */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">لینک‌های مفید</div>
                <div className="flex flex-wrap gap-2">
                  {giftCard.vouchers?.map((voucher, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="rounded-xl text-xs"
                      onClick={() => window.open(getVoucherLink(voucher.type || ''), '_blank')}
                    >
                      <ExternalLink size={12} className="ml-1" />
                      {voucher.type === 'internet' || voucher.type === 'voice' ? 'همراه اول' :
                       voucher.type === 'digikala' ? 'دیجی‌کالا' :
                       voucher.type === 'flytoday' ? 'فلای‌تودی' : 'وب‌سایت'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Voucher Details Modal */}
          {showVouchers && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">کدهای ووچر</h4>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  <span className="text-sm text-orange-600 font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 text-orange-800 text-sm">
                  <AlertCircle size={16} />
                  <span>کدهای ووچر تنها برای 5 دقیقه نمایش داده می‌شوند</span>
                </div>
              </div>

              <div className="space-y-3">
                {(Array.isArray(giftCard.vouchers) ? giftCard.vouchers : []).map((voucher, index) => (
                  <div 
                    key={index}
                    className="border rounded-xl p-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getVoucherIcon(voucher.type || '')}
                        <div>
                          <div className="font-medium text-gray-800">
                            {voucher.amount}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {voucher.type}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={voucher.used ? 'secondary' : 'solid'}
                        className="rounded-xl"
                      >
                        {voucher.used ? 'استفاده شده' : 'فعال'}
                      </Badge>
                    </div>

                    {!voucher.used && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">کد ووچر:</span>
                          <Button
                            variant="ghost"
                            onClick={() => toggleVoucherVisibility(voucher.id || '')}
                            className="rounded-lg"
                          >
                            {voucherVisibility[voucher.id || ''] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                        </div>
                        
                        {voucherVisibility[voucher.id || ''] && (
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <code className="text-sm font-mono">
                                {voucher.id || 'SAMPLE-CODE-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
                              </code>
                              <Button
                                variant="ghost"
                                onClick={() => handleCopyVoucher(
                                  voucher.id || '', 
                                  voucher.id || 'SAMPLE-CODE-' + Math.random().toString(36).substr(2, 9).toUpperCase()
                                )}
                                className="rounded-lg"
                              >
                                {copiedVoucher === voucher.id ? 
                                  <Check size={14} className="text-green-600" /> : 
                                  <Copy size={14} />
                                }
                              </Button>
                            </div>
                          </div>
                        )}

                        <Button
                          variant={voucher.used ? 'outline' : 'solid'}
                          className={`rounded-xl ${voucher.used ? '' : 'bg-[#439C55] hover:bg-[#3a8549] text-white'}`}
                        >
                          <ExternalLink size={14} className="ml-2" />
                          استفاده در وب‌سایت
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowVouchers(false)}
                className="w-full mt-4 rounded-xl"
              >
                بستن ووچرها
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}