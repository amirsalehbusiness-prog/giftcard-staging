import React from "react";
import { ChevronRight, Share2, CreditCard, ShoppingCart, LogIn } from "lucide-react";
import { Gift, User } from "lucide-react";
import { Button } from "./ui/button";
import { useSocial } from "../contexts/SocialContext";
import { useUser } from "../contexts/UserContext";
import { OCCASIONS } from "../data/occasions";
import {
  INTERNET_PACKS,
  VOICE_PACKS,
  DIGIKALA_VOUCHERS,
  FLYTODAY_VOUCHERS,
} from "../data/packages";
import { formatPrice } from "../utils/pricing";
import { useState } from "react";
import { generateUniqueId } from "../lib/utils";

type ReviewCardProps = {
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
  onPrevious: () => void;
  onPaymentComplete?: () => void;
};

export function ReviewCard({
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
  isPaid,
  onPrevious,
  onPaymentComplete,
}: ReviewCardProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(isPaid);
  const [showCartModal, setShowCartModal] = useState(false);
  const { createSocialProfile, socialProfiles, createPost } = useSocial();
  const { createUserAccount, loggedInUser, addToCart } = useUser();

  // هم‌راستا کردن وضعیت داخلی با prop
  React.useEffect(() => {
    setPaymentCompleted(isPaid);
  }, [isPaid]);

  // ⬇️ ذخیره‌ی اعتبار ورود در localStorage و نمایش پرامپت برای فرستنده
  const savedRef = React.useRef(false);
  React.useEffect(() => {
    if (!paymentCompleted || savedRef.current) return;

    const KEY = "userAccounts";

    try {
      // Create accounts for both recipient and sender
      const accounts = [];
      
      if (recipientPhone) {
        accounts.push({
          phone: String(recipientPhone).trim(),
          name: recipientName || '',
          role: 'recipient'
        });
      }
      
      // فقط برای گیرنده حساب ایجاد می‌کنیم، برای فرستنده بعداً پرسیده می‌شود
      
      // Create gift card data
      const giftCardData = {
        id: generateUniqueId(),
        occasion,
        customOccasion,
        recipientName,
        recipientPhone,
        senderPhone,
        senderName,
        message: message || "پیام تبریک ارسال شده است",
        internet,
        voice,
        dkVoucher,
        ftVoucher,
        oneYear,
        totalPrice,
        totalValue: totalPrice, // Add totalValue for UserProfile compatibility
        isPaid: true,
        createdAt: new Date().toISOString(),
        status: 'active',
        receivedDate: new Date().toLocaleDateString('fa-IR'),
        vouchers: [
          ...(internet ? [{
            id: `internet_${generateUniqueId()}`,
            type: 'internet',
            amount: INTERNET_PACKS.find(p => p.id === internet)?.label + ' گیگ',
            used: false
          }] : []),
          ...(voice ? [{
            id: `voice_${generateUniqueId()}`,
            type: 'voice', 
            amount: VOICE_PACKS.find(p => p.id === voice)?.label,
            used: false
          }] : []),
          ...(dkVoucher ? [{
            id: `dk_${generateUniqueId()}`,
            type: 'digikala',
            amount: DIGIKALA_VOUCHERS.find(p => p.id === dkVoucher)?.label,
            used: false
          }] : []),
          ...(ftVoucher ? [{
            id: `ft_${generateUniqueId()}`,
            type: 'flytoday',
            amount: FLYTODAY_VOUCHERS.find(p => p.id === ftVoucher)?.label,
            used: false
          }] : [])
        ]
      };

      const existingAccounts = JSON.parse(localStorage.getItem(KEY) || "[]");
      
      // فقط برای گیرنده حساب ایجاد می‌کنیم
      if (recipientPhone) {
        const accountInfo = accounts[0]; // recipient account
        const existingUserIndex = existingAccounts.findIndex((user: any) => user.phone === accountInfo.phone);
        
        if (existingUserIndex >= 0) {
          // Add gift card to existing user
          existingAccounts[existingUserIndex].giftCards = existingAccounts[existingUserIndex].giftCards || [];
          existingAccounts[existingUserIndex].giftCards.push(giftCardData);
          existingAccounts[existingUserIndex].password = accountInfo.phone; // Ensure password is set correctly
        } else {
          // Create new user account
          const newAccount = {
            id: `user-${generateUniqueId()}`,
            name: accountInfo.name,
            phone: accountInfo.phone,
            password: accountInfo.phone, // Use phone number as password
            giftCards: [giftCardData]
          };
          existingAccounts.push(newAccount);
        }
        
        // ایجاد پروفایل اجتماعی اگر وجود نداشته باشد
        const existingSocialProfile = socialProfiles.find(p => p.userId === accountInfo.phone);
        if (!existingSocialProfile) {
          createSocialProfile(accountInfo.phone, {
            displayName: accountInfo.name || 'کاربر جدید',
            username: `user_${accountInfo.phone.slice(-6)}`,
            showGiftStats: true,
            showInterests: true,
            showBirthday: true
          });
        }
      }
      
      localStorage.setItem(KEY, JSON.stringify(existingAccounts));


      // ایجاد پست خودکار برای دریافت هدیه
      if (recipientPhone) {
        setTimeout(() => {
          createPost({
            authorId: recipientPhone,
            content: `یک کارت هدیه زیبا برای ${getOccasionLabel(occasion)} دریافت کردم! 🎁`,
            type: 'gift_received',
            giftData: {
              giftCardId: giftCardData.id,
              occasion,
              totalValue: totalPrice,
              items: [
                ...(internet ? [`${INTERNET_PACKS.find(p => p.id === internet)?.label} گیگ اینترنت`] : []),
                ...(voice ? [`${VOICE_PACKS.find(p => p.id === voice)?.label}`] : []),
                ...(dkVoucher ? [`ووچر دیجی‌کالا ${DIGIKALA_VOUCHERS.find(p => p.id === dkVoucher)?.label}`] : []),
                ...(ftVoucher ? [`ووچر فلای‌تودی ${FLYTODAY_VOUCHERS.find(p => p.id === ftVoucher)?.label}`] : [])
              ]
            },
            likes: [],
            comments: [],
            shares: [],
            isPublic: true
          });
        }, 1000);
      }

      if (import.meta.env.DEV) {
        console.log("✅ userAccounts updated for recipient:", recipientPhone);
        console.log("✅ All accounts:", existingAccounts);
      }

      savedRef.current = true; // فقط یک‌بار ذخیره کند
      
    } catch (e) {
      console.warn("localStorage update error:", e);
    }
  }, [paymentCompleted, recipientPhone]);

  const getOccasionLabel = (occasion: string) => {
    if (occasion === "custom") return customOccasion || "بهانه دلخواه";
    const found = OCCASIONS.find((o) => o.key === occasion);
    return found ? found.label : occasion;
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    // شبیه‌سازی پرداخت
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    setPaymentCompleted(true);
    // مطابق فلوی قبلی پروژه:
    onPaymentComplete?.();
  };

  const handleAddToCart = () => {
    addToCart({
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
    });
    
    // ایجاد حساب کاربری برای فرستنده اگر وجود نداشته باشد
    if (senderPhone) {
      const existingAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
      const senderExists = existingAccounts.find((user: any) => user.phone === senderPhone);
      
      if (!senderExists) {
        const newSenderAccount = {
          id: generateUniqueId(),
          name: senderName || 'فرستنده',
          phone: senderPhone,
          password: senderPhone, // شماره موبایل به عنوان رمز عبور
          giftCards: []
        };
        existingAccounts.push(newSenderAccount);
        localStorage.setItem('userAccounts', JSON.stringify(existingAccounts));
        
        console.log('✅ Sender account created:', { phone: senderPhone, password: senderPhone });
      }
    }
    
    setShowCartModal(true);
  };

  const handleLoginRedirect = () => {
    window.dispatchEvent(new CustomEvent('navigateToLogin'));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-3">
          <ul className="text-sm leading-7">
            <li>
              بهانه:{" "}
              <b>
                {occasion === "custom"
                  ? customOccasion || "دلخواه"
                  : OCCASIONS.find((o) => o.key === occasion)?.label}
              </b>
            </li>
            <li>
              گیرنده: <b>{recipientName || "—"}</b>
            </li>
            <li>
              موبایل گیرنده: <b>{recipientPhone || "—"}</b>
            </li>
            <li>
              فرستنده: <b>{senderName || "—"}</b>
            </li>
            <li>
              اینترنت:{" "}
              <b>
                {internet
                  ? INTERNET_PACKS.find((p) => p.id === internet)?.label + " گیگ"
                  : "—"}
              </b>
            </li>
            <li>
              مکالمه:{" "}
              <b>{voice ? VOICE_PACKS.find((p) => p.id === voice)?.label : "—"}</b>
            </li>
            <li>
              دیجی‌کالا:{" "}
              <b>
                {dkVoucher
                  ? DIGIKALA_VOUCHERS.find((p) => p.id === dkVoucher)?.label
                  : "—"}
              </b>
            </li>
            <li>
              فلای‌تودی:{" "}
              <b>
                {ftVoucher
                  ? FLYTODAY_VOUCHERS.find((p) => p.id === ftVoucher)?.label
                  : "—"}
              </b>
            </li>
            <li>
              اعتبار زمانی: <b>{oneYear ? "یک‌سال" : "—"}</b>
            </li>
          </ul>
        </div>

        {totalPrice > 0 && (
          <div className="rounded-2xl border bg-gradient-to-r from-emerald-50 to-blue-50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-800">
                {formatPrice(totalPrice)} تومان
              </div>
              <div className="text-sm text-emerald-600">مبلغ قابل پرداخت</div>
            </div>
          </div>
        )}

        {paymentCompleted && (
          <div className="rounded-2xl border bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-green-200">
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-1">
                ✅ پرداخت با موفقیت انجام شد
              </div>
              <div className="text-sm text-green-700">
                کارت هدیه شما آماده اشتراک‌گذاری است
              </div>
            </div>
          </div>
        )}

        {paymentCompleted && recipientPhone && (
          <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-blue-200">
            <div className="text-center mb-3">
              <div className="text-blue-600 font-semibold mb-2">
                🔐 اطلاعات ورود به حساب کاربری
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-white rounded-lg p-2 border">
                <span className="text-gray-600">نام کاربری:</span>
                <span className="font-mono font-semibold text-blue-800">
                  {recipientPhone}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-2 border">
                <span className="text-gray-600">رمز عبور:</span>
                <span className="font-mono font-semibold text-blue-800">
                  {recipientPhone}
                </span>
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-2 text-center">
              این اطلاعات را برای ورود به سیستم نگه دارید
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" className="rounded-xl" onClick={onPrevious}>
            <ChevronRight className="ml-1" size={18} /> قبلی
          </Button>

          {/* اگر لاگین باشد - دکمه پرداخت */}
          {loggedInUser && totalPrice > 0 && !paymentCompleted ? (
            <Button
              className="rounded-xl bg-[#0095da] hover:bg-[#0085ca] text-white"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-1"></div>
                  در حال پردازش...
                </>
              ) : (
                <>
                  <CreditCard size={18} className="ml-1" /> پرداخت
                </>
              )}
            </Button>
          ) : 
          /* اگر لاگین نباشد یا کارت رایگان - دکمه اضافه به سبد خرید */
          !loggedInUser && !paymentCompleted ? (
            <Button
              className="rounded-xl bg-[#ff4f00] hover:bg-[#e63900] text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} className="ml-1" /> اضافه به سبد خرید
            </Button>
          ) : 
          /* پرداخت تکمیل شده */
          paymentCompleted ? (
            <div className="text-sm text-green-600 font-medium">
              {isPaid ? "اشتراک گذاری کارت هدیه فعال شد." : "در حال فعال‌سازی دکمه اشتراک..."}
            </div>
          ) : null}
        </div>

        {/* راهنمایی برای کاربران غیر لاگین */}
        {!loggedInUser && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <div className="text-blue-800 font-semibold mb-2">
              💡 برای تکمیل خرید و اشتراک‌گذاری کارت هدیه
            </div>
            <div className="text-sm text-blue-700 mb-3">
              خرید خود را با ثبت‌نام تکمیل کنید
            </div>
            <Button
              onClick={handleLoginRedirect}
              variant="outline"
              className="rounded-xl border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <LogIn size={16} className="ml-2" />
              ورود / ثبت‌نام
            </Button>
          </div>
        )}
      </div>

      {/* دکمه ساخت کارت جدید */}
      {paymentCompleted && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Button
            variant="outline"
            className="w-full rounded-xl border-2 border-[#0095da] text-[#0095da] hover:bg-[#0095da] hover:text-white transition-all duration-200"
            onClick={() => {
              if (window.confirm("آیا می‌خواهید کارت هدیه جدیدی بسازید؟ تغییرات فعلی حفظ خواهد شد.")) {
                window.location.reload();
              }
            }}
          >
            <Gift size={18} className="ml-2" />
            سفارش کارت هدیه جدید
          </Button>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setShowCartModal(false)}
          />
          
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#ff4f00] to-[#ff6b35] flex items-center justify-center text-white mx-auto mb-4">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">✅ به سبد خرید اضافه شد</h3>
                <p className="text-gray-600">کارت هدیه شما به سبد خرید اضافه شد</p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleLoginRedirect}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] text-white py-3"
                >
                  <LogIn size={18} className="ml-2" />
                  ورود به سبد خرید
                </Button>
                
                <Button
                  onClick={() => setShowCartModal(false)}
                  variant="outline"
                  className="w-full rounded-2xl"
                >
                  ادامه خرید
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}