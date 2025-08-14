import React from 'react';
import { Gift } from 'lucide-react';
import { OCCASIONS } from '../data/occasions';
import { INTERNET_PACKS, VOICE_PACKS, DIGIKALA_VOUCHERS, FLYTODAY_VOUCHERS } from '../data/packages';
import { formatPrice } from '../utils/pricing';
import type { OccasionItem } from '../types';

type GiftCardImageProps = {
  occasion: string;
  customOccasion: string;
  recipientName: string;
    recipientPhone: string | null; // ← تغییر
  senderPhone: string | null;
  senderName: string;
  message: string;
  internet: string | null;
  voice: string | null;
  dkVoucher: string | null;
  ftVoucher: string | null;
  oneYear: boolean;
  totalPrice: number;
  showPrice: boolean;
};

export function GiftCardImage({
  occasion,
  customOccasion,
  recipientName,
  recipientPhone,
  senderPhone,
  senderName,
  message,
  internet,
  voice,
  dkVoucher,
  ftVoucher,
  oneYear,
  totalPrice,
  showPrice
}: GiftCardImageProps) {
  const selectedOccasion: OccasionItem = OCCASIONS.find((o) => o.key === occasion) || OCCASIONS[0];

  return (
    <div 
      id="gift-card-image" 
      className="w-[600px] h-[800px] bg-white relative overflow-hidden mx-auto"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Background with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${selectedOccasion.theme.primary}15, ${selectedOccasion.theme.secondary}15)`
        }}
      >
        {/* Decorative patterns */}
        <div 
          className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: selectedOccasion.theme.primary }}
        />
        <div 
          className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-10"
          style={{ backgroundColor: selectedOccasion.theme.secondary }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: selectedOccasion.theme.accent }}
        />
        
        {/* Pattern elements */}
        <div className="absolute top-12 right-12 text-4xl opacity-20">
          {selectedOccasion.theme.pattern}
        </div>
        <div className="absolute bottom-12 left-12 text-3xl opacity-20">
          {selectedOccasion.theme.pattern}
        </div>
        <div className="absolute top-1/3 left-1/4 text-5xl opacity-10">
          {selectedOccasion.theme.pattern}
        </div>
      </div>

      {/* Header */}
      <div 
        className="relative h-24 flex items-center justify-center text-white"
        style={{
          background: `linear-gradient(135deg, ${selectedOccasion.theme.primary}, ${selectedOccasion.theme.secondary})`
        }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Gift size={20} />
            </div>
            <div>
              <div className="text-sm opacity-90">همراه اول</div>
              <div className="text-xl font-bold">هدیه همراه</div>
            </div>
          </div>
          <div className="text-sm font-semibold opacity-95">
            {occasion === "custom" ? customOccasion || "بهانه دلخواه" : selectedOccasion.label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-6">
        {/* Recipient Info */}
        <div className="text-center mb-6">
          <div className="text-base text-gray-600 mb-2">این هدیه برای</div>
          <div 
            className="text-3xl font-bold mb-2"
            style={{ color: selectedOccasion.theme.primary }}
          >
            {recipientName || "عزیز"}
          </div>
          <div className="text-sm text-gray-600">
            از طرف: <span className="font-semibold text-gray-800 text-base">{senderName || "دوست"}</span>
          </div>
        </div>

        {/* Message */}
        <div 
          className="rounded-2xl p-4 mb-6 text-center text-sm leading-6 border-2"
          style={{ 
            backgroundColor: selectedOccasion.theme.primary + '08',
            borderColor: selectedOccasion.theme.primary + '30',
            color: '#374151'
          }}
        >
          {message}
        </div>

        {/* Gifts Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {internet && (
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: selectedOccasion.theme.primary }}
                >
                  📶
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    {INTERNET_PACKS.find((p) => p.id === internet)?.label} گیگ
                  </div>
                  <div className="text-xs text-gray-600">بسته اینترنت</div>
                </div>
              </div>
            </div>
          )}

          {voice && (
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: selectedOccasion.theme.secondary }}
                >
                  📞
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    {VOICE_PACKS.find((p) => p.id === voice)?.label}
                  </div>
                  <div className="text-xs text-gray-600">بسته مکالمه</div>
                </div>
              </div>
            </div>
          )}

          {dkVoucher && (
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: selectedOccasion.theme.accent }}
                >
                  🛒
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    {DIGIKALA_VOUCHERS.find((p) => p.id === dkVoucher)?.label}
                  </div>
                  <div className="text-xs text-gray-600">ووچر دیجی‌کالا</div>
                </div>
              </div>
            </div>
          )}

          {ftVoucher && (
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: selectedOccasion.theme.primary }}
                >
                  ✈️
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    {FLYTODAY_VOUCHERS.find((p) => p.id === ftVoucher)?.label}
                  </div>
                  <div className="text-xs text-gray-600">ووچر فلای‌تودی</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price (if enabled) */}
        {showPrice && totalPrice > 0 && (
          <div 
            className="rounded-2xl p-4 text-center border-2 mb-4"
            style={{ 
              background: `linear-gradient(135deg, ${selectedOccasion.theme.primary}15, ${selectedOccasion.theme.secondary}15)`,
              borderColor: selectedOccasion.theme.primary + '40'
            }}
          >
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: selectedOccasion.theme.primary }}
            >
              {formatPrice(totalPrice)} تومان
            </div>
            <div className="text-sm text-gray-600">ارزش کل هدیه</div>
          </div>
        )}

        {/* Validity */}
        {oneYear && (
          <div className="text-center mb-4">
            <div 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold border-2"
              style={{ 
                color: selectedOccasion.theme.primary,
                borderColor: selectedOccasion.theme.primary + '60',
                backgroundColor: selectedOccasion.theme.primary + '15'
              }}
            >
              اعتبار: یک سال
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-500">
          هدیه همراه • همراه اول • {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>
    </div>
  );
}