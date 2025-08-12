import { Gift, Wifi, Phone, ShoppingBag, Plane, Pencil, Share2, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { OCCASIONS } from "../data/occasions";
import { INTERNET_PACKS, VOICE_PACKS, DIGIKALA_VOUCHERS, FLYTODAY_VOUCHERS } from "../data/packages";
import { formatPrice } from "../utils/pricing";
import { GiftCardImage } from "./GiftCardImage";
import { shareGiftCardImage } from "../utils/imageGenerator";
import type { OccasionItem } from "../types";

type PreviewCardProps = {
  occasion: string;
  customOccasion: string;
  recipientName: string;
  recipientPhone: string | null;
  senderName: string;
  message: string;
  internet: string | null;
  voice: string | null;
  dkVoucher: string | null;
  ftVoucher: string | null;
  oneYear: boolean;
  totalPrice: number;
  isPaid: boolean;
};

export function PreviewCard({
  occasion,
  customOccasion,
  recipientName,
  recipientPhone,
  senderName,
  message,
  internet,
  voice,
  dkVoucher,
  ftVoucher,
  oneYear,
  totalPrice,
  isPaid
}: PreviewCardProps) {
  const selectedOccasion: OccasionItem = OCCASIONS.find((o) => o.key === occasion) || OCCASIONS[0];
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPriceInShare, setShowPriceInShare] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const shareText = `🎁 ${selectedOccasion.label === "بهانه دلخواه" ? customOccasion : selectedOccasion.label}

برای: ${recipientName || "عزیز"}
موبایل: ${recipientPhone || "—"}
از طرف: ${senderName || "دوست"}

${message}

${internet ? `📶 ${INTERNET_PACKS.find(p => p.id === internet)?.label} گیگ اینترنت\n` : ''}${voice ? `📞 ${VOICE_PACKS.find(p => p.id === voice)?.label}\n` : ''}${dkVoucher ? `🛒 ووچر دیجی‌کالا ${DIGIKALA_VOUCHERS.find(p => p.id === dkVoucher)?.label}\n` : ''}${ftVoucher ? `✈️ ووچر فلای‌تودی ${FLYTODAY_VOUCHERS.find(p => p.id === ftVoucher)?.label}\n` : ''}
${totalPrice > 0 ? `💰 مبلغ: ${formatPrice(totalPrice)} تومان` : ''}

هدیه همراه - همراه اول`;

  const handleShare = async (platform: 'telegram' | 'whatsapp' | 'copy') => {
    setIsGeneratingPDF(true);
    try {
      await shareGiftCardImage('gift-card-image', platform, shareText, showPriceInShare, recipientPhone);
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="relative">
      {/* Hidden Image Component */}
      <div className="fixed -top-[9999px] -left-[9999px] pointer-events-none">
        <GiftCardImage
          occasion={occasion}
          customOccasion={customOccasion}
          recipientName={recipientName}
          recipientPhone={recipientPhone}
          senderName={senderName}
          message={message}
          internet={internet}
          voice={voice}
          dkVoucher={dkVoucher}
          ftVoucher={ftVoucher}
          oneYear={oneYear}
          totalPrice={totalPrice}
          showPrice={showPriceInShare}
        />
      </div>

      <Card className="rounded-3xl shadow-lg overflow-hidden">
      <CardHeader className="p-0">
        <div className={`h-40 bg-gradient-to-br ${selectedOccasion.gradient} relative overflow-hidden`}>
          {/* المان‌های تزئینی */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-6xl">{selectedOccasion.theme.pattern}</div>
            <div className="absolute bottom-4 left-4 text-4xl rotate-12">{selectedOccasion.theme.pattern}</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-50">{selectedOccasion.theme.pattern}</div>
          </div>
          
          {/* آیکون‌های تزئینی */}
          <div className="absolute inset-0">
            {selectedOccasion.theme.decorativeElements.map((Element, index) => (
              <div
                key={index}
                className={`absolute text-white/20 ${
                  index === 0 ? 'top-6 right-6' : 
                  index === 1 ? 'bottom-6 left-6' : 
                  'top-1/3 left-1/4'
                }`}
              >
                <Element size={index === 0 ? 32 : 24} />
              </div>
            ))}
          </div>
          
          {/* خطوط هندسی مینیمال */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-white/10 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-white/10 rounded-bl-3xl"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="-mt-14">
        <div className="relative mx-auto max-w-md -mt-12">
          <div className="rounded-3xl border bg-white shadow-sm p-5 relative overflow-hidden">
            {/* بک‌گراند مینیمال */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5" style={{ backgroundColor: selectedOccasion.theme.primary }}></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-5" style={{ backgroundColor: selectedOccasion.theme.secondary }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white" style={{ background: selectedOccasion.theme.primary }}>
                    <Gift size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">هدیه همراه</div>
                    <div className="font-bold">{occasion === "custom" ? customOccasion || "بهانه دلخواه" : selectedOccasion.label}</div>
                  </div>
                </div>
                <Badge className="rounded-xl" style={{ backgroundColor: selectedOccasion.theme.accent + '20', color: selectedOccasion.theme.primary }}>
                  کارت دیجیتال
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <div className="text-sm text-neutral-500">برای</div>
                <div className="text-xl font-black">{recipientName || "—"}</div>
                <div className="text-sm text-neutral-500">از طرف</div>
                <div className="font-semibold">{senderName || "—"}</div>
              </div>

              <div 
                className="mt-4 rounded-2xl p-3 text-sm leading-7 border" 
                style={{ 
                  backgroundColor: selectedOccasion.theme.primary + '08',
                  borderColor: selectedOccasion.theme.primary + '20'
                }}
              >
                {message}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {internet && (
                  <Badge variant="secondary" className="rounded-xl flex items-center gap-1">
                    <Wifi size={14} /> {INTERNET_PACKS.find((p) => p.id === internet)?.label} گیگ اینترنت
                  </Badge>
                )}
                {voice && (
                  <Badge variant="secondary" className="rounded-xl flex items-center gap-1">
                    <Phone size={14} /> {VOICE_PACKS.find((p) => p.id === voice)?.label}
                  </Badge>
                )}
                {dkVoucher && (
                  <Badge variant="secondary" className="rounded-xl flex items-center gap-1">
                    <ShoppingBag size={14} /> دیجی‌کالا {DIGIKALA_VOUCHERS.find((p) => p.id === dkVoucher)?.label}
                  </Badge>
                )}
                {ftVoucher && (
                  <Badge variant="secondary" className="rounded-xl flex items-center gap-1">
                    <Plane size={14} /> فلای‌تودی {FLYTODAY_VOUCHERS.find((p) => p.id === ftVoucher)?.label}
                  </Badge>
                )}
                {oneYear && (
                  <Badge 
                    variant="outline" 
                    className="rounded-xl" 
                    style={{ borderColor: selectedOccasion.theme.primary, color: selectedOccasion.theme.primary }}
                  >
                    اعتبار: یک‌سال
                  </Badge>
                )}
              </div>

              {totalPrice > 0 && (
                <div 
                  className="mt-4 mb-6 rounded-2xl p-3 border"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedOccasion.theme.primary}08, ${selectedOccasion.theme.secondary}08)`,
                    borderColor: selectedOccasion.theme.primary + '20'
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: selectedOccasion.theme.primary }}>
                      {formatPrice(totalPrice)} تومان
                    </div>
                    <div className="text-xs mt-2" style={{ color: selectedOccasion.theme.secondary }}>
                      مبلغ قابل پرداخت
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              <div className="flex items-center justify-between">
                <Button variant="ghost" className="rounded-xl text-neutral-500 hover:text-neutral-800">
                  <Pencil size={18} className="ml-1" /> ویرایش جزئیات
                </Button>
                {isPaid ? (
                  <Button 
                    className="rounded-xl text-white"
                    onClick={() => setShowShareModal(true)}
                    style={{ backgroundColor: selectedOccasion.theme.primary }}
                  >
                    <Share2 size={18} className="ml-1" /> دریافت لینک کارت
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="rounded-xl text-neutral-400 cursor-not-allowed"
                    disabled
                  >
                    <Share2 size={18} className="ml-1" /> دریافت لینک کارت
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center py-6 bg-neutral-50">
        <div className="text-xs text-neutral-500">
          تم فعلی: {selectedOccasion.label} • رنگ اصلی: {selectedOccasion.theme.primary}
        </div>
      </CardFooter>
    </Card>

      {/* Share Modal */}
      {showShareModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setShowShareModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 left-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white mx-auto mb-3">
                  <Share2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">اشتراک‌گذاری کارت هدیه</h3>
                <p className="text-sm text-neutral-500 mt-1">کارت هدیه به صورت تصویر تولید شده و به اشتراک گذاشته می‌شود</p>
              </div>
              
              {/* Price Display Option */}
              {totalPrice > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">نمایش قیمت در کارت</div>
                      <div className="text-sm text-gray-600">آیا ارزش هدیه روی کارت نوشته شود؟</div>
                    </div>
                    <Switch 
                      checked={showPriceInShare} 
                      onCheckedChange={setShowPriceInShare}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleShare('telegram')}
                  disabled={isGeneratingPDF}
                  className="w-full rounded-2xl bg-[#0088cc] hover:bg-[#0077bb] text-white flex items-center justify-center gap-3 py-3"
                >
                  <MessageCircle size={20} />
                  {isGeneratingPDF ? 'در حال تولید تصویر...' : 'اشتراک در تلگرام'}
                </Button>
                
                <Button
                  onClick={() => handleShare('whatsapp')}
                  disabled={isGeneratingPDF}
                  className="w-full rounded-2xl bg-[#25d366] hover:bg-[#22c55e] text-white flex items-center justify-center gap-3 py-3"
                >
                  <MessageCircle size={20} />
                  {isGeneratingPDF ? 'در حال تولید تصویر...' : 'اشتراک در واتس‌اپ'}
                </Button>
                
                <Button
                  onClick={() => handleShare('copy')}
                  disabled={isGeneratingPDF}
                  variant="outline"
                  className="w-full rounded-2xl border-2 border-neutral-200 hover:bg-neutral-50 flex items-center justify-center gap-3 py-3"
                >
                  📋 {isGeneratingPDF ? 'در حال تولید تصویر...' : 'کپی متن و دانلود تصویر'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}