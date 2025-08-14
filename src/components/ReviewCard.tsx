import React from "react";
import { ChevronRight, Share2, CreditCard } from "lucide-react";
import { Gift, User, LogIn } from "lucide-react";
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
  const [showSenderProfilePrompt, setShowSenderProfilePrompt] = useState(false);
  const [senderProfileCreated, setSenderProfileCreated] = useState(false);
  const { createSocialProfile, socialProfiles, createPost } = useSocial();
  const { createUserAccount } = useUser();

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
        id: Date.now().toString(),
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
            id: `internet_${Date.now()}`,
            type: 'internet',
            amount: INTERNET_PACKS.find(p => p.id === internet)?.label + ' گیگ',
            used: false
          }] : []),
          ...(voice ? [{
            id: `voice_${Date.now()}`,
            type: 'voice', 
            amount: VOICE_PACKS.find(p => p.id === voice)?.label,
            used: false
          }] : []),
          ...(dkVoucher ? [{
            id: `dk_${Date.now()}`,
            type: 'digikala',
            amount: DIGIKALA_VOUCHERS.find(p => p.id === dkVoucher)?.label,
            used: false
          }] : []),
          ...(ftVoucher ? [{
            id: `ft_${Date.now()}`,
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
            id: Date.now().toString(),
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
      
      // نمایش پرامپت برای فرستنده (اگر شماره فرستنده وجود داشته باشد)
      if (senderPhone && senderPhone !== recipientPhone) {
        setTimeout(() => {
          setShowSenderProfilePrompt(true);
        }, 2000);
      }
    } catch (e) {
      console.warn("localStorage update error:", e);
    }
  }, [paymentCompleted, recipientPhone, senderPhone]);

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

  const handleCreateSenderProfile = () => {
    if (!senderPhone) return;
    
    // ایجاد حساب کاربری برای فرستنده
    createUserAccount(senderPhone, {
      id: `sender_${Date.now()}`,
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
      totalValue: totalPrice,
      isPaid: true,
      createdAt: new Date().toISOString(),
      status: 'active',
      vouchers: []
    });
    
    // ایجاد پروفایل اجتماعی برای فرستنده
    const existingSocialProfile = socialProfiles.find(p => p.userId === senderPhone);
    if (!existingSocialProfile) {
      createSocialProfile(senderPhone, {
        displayName: senderName || 'کاربر جدید',
        username: `user_${senderPhone.slice(-6)}`,
        showGiftStats: true,
        showInterests: true,
        showBirthday: true
      });
    }
    
    setSenderProfileCreated(true);
    setShowSenderProfilePrompt(false);
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

        {/* پرامپت ایجاد پروفایل برای فرستنده */}
        {showSenderProfilePrompt && senderPhone && (
          <div className="rounded-2xl border bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-purple-200">
            <div className="text-center mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-3">
                <User size={24} />
              </div>
              <div className="text-purple-800 font-semibold mb-2">
                🎁 ایجاد حساب کاربری برای مدیریت هدایا
              </div>
              <div className="text-sm text-purple-700 leading-6">
                برای مدیریت کارت‌های هدیه‌ای که می‌دهید و احتمال دریافت هدیه در آینده، 
                می‌خواهید حساب کاربری داشته باشید؟
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 mb-4 border border-purple-200">
              <div className="text-sm text-gray-700 mb-3">
                <strong>اطلاعات ورود شما:</strong>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">نام کاربری:</span>
                  <span className="font-mono font-semibold text-purple-800">
                    {senderPhone}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">رمز عبور:</span>
                  <span className="font-mono font-semibold text-purple-800">
                    {senderPhone}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCreateSenderProfile}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <User size={18} className="ml-2" />
                بله، حساب کاربری ایجاد کن
              </Button>
              <Button
                onClick={() => setShowSenderProfilePrompt(false)}
                variant="outline"
                className="flex-1 rounded-xl border-purple-200 text-purple-700"
              >
                فعلاً نه، ممنون
              </Button>
            </div>
          </div>
        )}

        {/* نمایش اطلاعات ورود و دکمه لاگین برای فرستنده */}
        {senderProfileCreated && senderPhone && (
          <div className="rounded-2xl border bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-green-200">
            <div className="text-center mb-4">
              <div className="text-green-600 font-semibold mb-2">
                ✅ حساب کاربری شما با موفقیت ایجاد شد
              </div>
              <div className="text-sm text-green-700">
                حالا می‌توانید وارد حساب کاربری خود شوید
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 mb-4 border border-green-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">نام کاربری:</span>
                  <span className="font-mono font-semibold text-green-800">
                    {senderPhone}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">رمز عبور:</span>
                  <span className="font-mono font-semibold text-green-800">
                    {senderPhone}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => {
                // انتقال به صفحه لاگین
                window.dispatchEvent(new CustomEvent('navigateToLogin'));
              }}
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            >
              <LogIn size={18} className="ml-2" />
              ورود به حساب کاربری
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" className="rounded-xl" onClick={onPrevious}>
            <ChevronRight className="ml-1" size={18} /> قبلی
          </Button>

          {totalPrice > 0 && !paymentCompleted ? (
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
          ) : !paymentCompleted && totalPrice === 0 ? (
            <Button
              className="rounded-xl bg-[#0095da] hover:bg-[#0085ca] text-white"
              onClick={() => onPaymentComplete?.()}
            >
              <Share2 size={18} className="ml-1" /> دریافت کارت رایگان
            </Button>
          ) : paymentCompleted ? (
            <div className="text-sm text-green-600 font-medium">
              {isPaid ? "اشتراک گذاری کارت هدیه فعال شد." : "در حال فعال‌سازی دکمه اشتراک..."}
            </div>
          ) : null}
        </div>
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
    </>
  );
}