import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  Gift, 
  User, 
  MessageSquare,
  Calendar,
  Calculator,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useUser } from '../../contexts/UserContext';
import { useSocial } from '../../contexts/SocialContext';
import { OCCASIONS } from '../../data/occasions';
import { INTERNET_PACKS, VOICE_PACKS, DIGIKALA_VOUCHERS, FLYTODAY_VOUCHERS } from '../../data/packages';
import { formatPrice } from '../../utils/pricing';
import { PreviewCard } from "../PreviewCard";
import type { CartItem } from '../types';

type CompletedGiftCard = {
  id: string;
  occasion: string;
  customOccasion: string;
  recipientName: string;
  recipientPhone: string | null;
  senderPhone: string | null;
  senderName: string;
  message: string;
  internet: string | null;
  voice: string | null;
  dkVoucher: string | null;
  ftVoucher: string | null;
  oneYear: boolean;
  totalPrice: number;
  isPaid: boolean;
  createdAt: string;
};

export function CartManager() {
export function SocialFeed() {
  const { cartItems, removeFromCart, clearCart, createUserAccount, loggedInUser } = useUser();
  const { createSocialProfile, socialProfiles, createPost } = useSocial();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [completedGiftCards, setCompletedGiftCards] = useState<CompletedGiftCard[]>([]);

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const getOccasionLabel = (occasion: string, customOccasion: string) => {
    if (occasion === "custom") return customOccasion || "بهانه دلخواه";
    const found = OCCASIONS.find((o) => o.key === occasion);
    return found ? found.label : occasion;
  };

  const handlePaymentForItem = async (item: CartItem) => {
    setIsProcessingPayment(true);
    
    try {
      // شبیه‌سازی پرداخت
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ایجاد کارت هدیه
      const giftCardData = {
        id: `gift-${generateUniqueId()}`,
        occasion: item.occasion,
        customOccasion: item.customOccasion,
        recipientName: item.recipientName,
        recipientPhone: item.recipientPhone,
        senderPhone: item.senderPhone,
        senderName: item.senderName,
        message: item.message || "پیام تبریک ارسال شده است",
        internet: item.internet,
        voice: item.voice,
        dkVoucher: item.dkVoucher,
        ftVoucher: item.ftVoucher,
        oneYear: item.oneYear,
        totalPrice: item.totalPrice,
        totalValue: item.totalPrice,
        isPaid: true,
        createdAt: new Date().toISOString(),
        status: 'active',
        receivedDate: new Date().toLocaleDateString('fa-IR'),
        vouchers: [
          ...(item.internet ? [{
            id: `internet_${generateUniqueId()}`,
            type: 'internet',
            amount: INTERNET_PACKS.find(p => p.id === item.internet)?.label + ' گیگ',
            used: false
          }] : []),
          ...(item.voice ? [{
            id: `voice_${generateUniqueId()}`,
            type: 'voice', 
            amount: VOICE_PACKS.find(p => p.id === item.voice)?.label,
            used: false
          }] : []),
          ...(item.dkVoucher ? [{
            id: `dk_${Date.now()}`,
            type: 'digikala',
            amount: DIGIKALA_VOUCHERS.find(p => p.id === item.dkVoucher)?.label,
            used: false
          }] : []),
          ...(item.ftVoucher ? [{
            id: `ft_${Date.now()}`,
            type: 'flytoday',
            amount: FLYTODAY_VOUCHERS.find(p => p.id === item.ftVoucher)?.label,
            used: false
          }] : [])
        ]
      };

      // ایجاد حساب کاربری برای گیرنده
      if (item.recipientPhone) {
        createUserAccount(item.recipientPhone, giftCardData);
        
        // ایجاد پروفایل اجتماعی اگر وجود نداشته باشد
        const existingSocialProfile = socialProfiles.find(p => p.userId === item.recipientPhone);
        if (!existingSocialProfile) {
          createSocialProfile(item.recipientPhone, {
            displayName: item.recipientName || 'کاربر جدید',
            username: `user_${item.recipientPhone.slice(-6)}`,
            showGiftStats: true,
            showInterests: true,
            showBirthday: true
          });
        }

        // ایجاد پست خودکار برای دریافت هدیه
        setTimeout(() => {
          createPost({
            authorId: item.recipientPhone!,
            content: `یک کارت هدیه زیبا برای ${getOccasionLabel(item.occasion, item.customOccasion)} دریافت کردم! 🎁`,
            type: 'gift_received',
            giftData: {
              giftCardId: giftCardData.id,
              occasion: item.occasion,
              totalValue: item.totalPrice,
              items: [
                ...(item.internet ? [`${INTERNET_PACKS.find(p => p.id === item.internet)?.label} گیگ اینترنت`] : []),
                ...(item.voice ? [`${VOICE_PACKS.find(p => p.id === item.voice)?.label}`] : []),
                ...(item.dkVoucher ? [`ووچر دیجی‌کالا ${DIGIKALA_VOUCHERS.find(p => p.id === item.dkVoucher)?.label}`] : []),
                ...(item.ftVoucher ? [`ووچر فلای‌تودی ${FLYTODAY_VOUCHERS.find(p => p.id === item.ftVoucher)?.label}`] : [])
              ]
            },
            likes: [],
            comments: [],
            shares: [],
            isPublic: true
          });
        }, 1000);
      }

      // علامت‌گذاری به عنوان تکمیل شده
      setCompletedItems(prev => new Set([...prev, item.id]));
      
      // اضافه کردن به لیست کارت‌های تکمیل شده برای نمایش
      const completedCard: CompletedGiftCard = {
        id: giftCardData.id,
        occasion: item.occasion,
        customOccasion: item.customOccasion,
        recipientName: item.recipientName,
        recipientPhone: item.recipientPhone,
        senderPhone: item.senderPhone,
        senderName: item.senderName,
        message: item.message,
        internet: item.internet,
        voice: item.voice,
        dkVoucher: item.dkVoucher,
        ftVoucher: item.ftVoucher,
        oneYear: item.oneYear,
        totalPrice: item.totalPrice,
        isPaid: true,
        createdAt: giftCardData.createdAt
      };
      setCompletedGiftCards(prev => [...prev, completedCard]);
      
      // حذف از سبد خرید
      setTimeout(() => {
        removeFromCart(item.id);
      }, 3000);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('خطا در پرداخت. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleClearCart = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
      clearCart();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              سبد خرید ({cartItems.length} آیتم)
            </CardTitle>
            {cartItems.length > 0 && (
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 size={16} className="ml-2" />
                خالی کردن سبد
              </Button>
            )}
          </div>
        </CardHeader>
        
        {totalCartValue > 0 && (
          <CardContent style={{ paddingTop: '0px' }}>
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator size={18} className="text-emerald-600" />
                  <span className="font-semibold text-emerald-800">مجموع سبد خرید:</span>
                </div>
                <div className="text-2xl font-bold text-emerald-800">
                  {formatPrice(totalCartValue)} تومان
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center" style={{ paddingTop: '48px' }}>
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h3>
            <p className="text-gray-600">کارت‌های هدیه‌ای که به سبد خرید اضافه کرده‌اید اینجا نمایش داده می‌شود</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => {
            const isCompleted = completedItems.has(item.id);
            const selectedOccasion = OCCASIONS.find(o => o.key === item.occasion) || OCCASIONS[0];
            
            return (
              <Card 
                key={item.id} 
                className={`rounded-2xl transition-all ${
                  isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'
                }`}
              >
                <CardContent className="p-6" style={{ paddingTop: '24px' }}>
                  {isCompleted && (
                    <div className="flex items-center gap-2 mb-4 text-green-600">
                      <CheckCircle size={20} />
                      <span className="font-semibold">پرداخت موفق - در حال حذف از سبد...</span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 rounded-2xl flex items-center justify-center text-white"
                        style={{ background: selectedOccasion.gradient.replace('from-', '').replace('to-', '').split(' ').join(', ') }}
                      >
                        <Gift size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {getOccasionLabel(item.occasion, item.customOccasion)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          برای: {item.recipientName} • از طرف: {item.senderName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">
                        {formatPrice(item.totalPrice)} تومان
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-gray-600" />
                        <span className="text-gray-700">گیرنده: {item.recipientName}</span>
                      </div>
                      {item.recipientPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">📱</span>
                          <span className="text-gray-700">{item.recipientPhone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-gray-600" />
                        <span className="text-gray-700">فرستنده: {item.senderName}</span>
                      </div>
                      {item.senderPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">📱</span>
                          <span className="text-gray-700">{item.senderPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  {item.message && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">پیام تبریک</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
                        {item.message}
                      </div>
                    </div>
                  )}

                  {/* Bundles */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">محتویات هدیه:</div>
                    <div className="flex flex-wrap gap-2">
                      {item.internet && (
                        <Badge variant="secondary" className="rounded-xl">
                          📶 {INTERNET_PACKS.find(p => p.id === item.internet)?.label} گیگ
                        </Badge>
                      )}
                      {item.voice && (
                        <Badge variant="secondary" className="rounded-xl">
                          📞 {VOICE_PACKS.find(p => p.id === item.voice)?.label}
                        </Badge>
                      )}
                      {item.dkVoucher && (
                        <Badge variant="secondary" className="rounded-xl">
                          🛒 دیجی‌کالا {DIGIKALA_VOUCHERS.find(p => p.id === item.dkVoucher)?.label}
                        </Badge>
                      )}
                      {item.ftVoucher && (
                        <Badge variant="secondary" className="rounded-xl">
                          ✈️ فلای‌تودی {FLYTODAY_VOUCHERS.find(p => p.id === item.ftVoucher)?.label}
                        </Badge>
                      )}
                      {item.oneYear && (
                        <Badge variant="outline" className="rounded-xl">
                          📅 اعتبار: یک‌سال
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="outline"
                      className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                      disabled={isProcessingPayment || isCompleted}
                    >
                      <Trash2 size={16} className="ml-2" />
                      حذف از سبد
                    </Button>
                    
                    <Button
                      onClick={() => handlePaymentForItem(item)}
                      disabled={isProcessingPayment || isCompleted}
                      className="flex-1 rounded-xl bg-[#0095da] hover:bg-[#0085ca] text-white"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
                          در حال پردازش...
                        </>
                      ) : isCompleted ? (
                        <>
                          <CheckCircle size={18} className="ml-2" />
                          پرداخت شده
                        </>
                      ) : (
                        <>
                          <CreditCard size={18} className="ml-2" />
                          پرداخت {formatPrice(item.totalPrice)} تومان
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show completed gift cards for sharing */}
      {completedGiftCards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">کارت‌های هدیه تکمیل شده</h3>
            <Badge className="rounded-xl bg-green-100 text-green-800">
              آماده اشتراک‌گذاری
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedGiftCards.slice(-3).map((giftCard) => (
              <div key={`completed-${giftCard.id}`} className="max-w-md mx-auto">
                <PreviewCard
                  occasion={giftCard.occasion}
                  customOccasion={giftCard.customOccasion}
                  recipientName={giftCard.recipientName}
                  recipientPhone={giftCard.recipientPhone}
                  senderPhone={giftCard.senderPhone}
                  senderName={giftCard.senderName}
                  message={giftCard.message}
                  internet={giftCard.internet}
                  voice={giftCard.voice}
                  dkVoucher={giftCard.dkVoucher}
                  ftVoucher={giftCard.ftVoucher}
                  oneYear={giftCard.oneYear}
                  totalPrice={giftCard.totalPrice}
                  isPaid={true}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => setCompletedGiftCards([])}
              variant="outline"
              className="rounded-xl text-gray-600"
            >
              پاک کردن کارت‌های نمایش داده شده
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {cartItems.length > 0 && (
        <Card className="rounded-2xl">
          <CardContent className="p-6" style={{ paddingTop: '24px' }}>
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-4">عملیات سریع</h4>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    // پرداخت همه آیتم‌ها
                    cartItems.forEach(item => {
                      if (!completedItems.has(item.id)) {
                        handlePaymentForItem(item);
                      }
                    });
                  }}
                  disabled={isProcessingPayment}
                  className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                >
                  <CreditCard size={18} className="ml-2" />
                  پرداخت همه ({formatPrice(totalCartValue)} تومان)
                </Button>
                
                <Button
                  onClick={() => {
                    // بازگشت به ویزارد برای خرید جدید
                    window.location.reload();
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Gift size={18} className="ml-2" />
                  خرید جدید
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}