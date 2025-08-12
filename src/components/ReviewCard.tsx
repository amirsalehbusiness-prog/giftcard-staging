import React from "react";
import { ChevronRight, Share2, CreditCard } from "lucide-react";
import { Gift } from "lucide-react";
import { Button } from "./ui/button";
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
  senderName: string;
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
  senderName,
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
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  // هم‌راستا کردن وضعیت داخلی با prop
  React.useEffect(() => {
    setPaymentCompleted(isPaid);
  }, [isPaid]);

  // ساخت پسورد بعد از تکمیل پرداخت
  React.useEffect(() => {
    if (paymentCompleted && !generatedPassword) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedPassword(password);
    }
  }, [paymentCompleted, generatedPassword]);

  // ⬇️ ذخیره‌ی اعتبار ورود در localStorage (سازگار با ساختار قبلی پروژه)
  const savedRef = React.useRef(false);
  React.useEffect(() => {
    if (!paymentCompleted || !recipientPhone || !generatedPassword || savedRef.current) return;

    const KEY = "userAccounts";
    type Account = {
      phone?: string;
      username?: string; // برای سازگاری به عقب
      password: string;
      // سایر فیلدهای قبلی اگر بود، همونجا حفظ می‌شن چون ما upsert می‌کنیم
    };

    try {
      const phone = String(recipientPhone).trim();
      const list: Account[] = JSON.parse(localStorage.getItem(KEY) || "[]");

      // upsert بر اساس phone/username
      const idx = list.findIndex(
        (x) => x.phone === phone || x.username === phone
      );

      const next: Account =
        idx >= 0
          ? { ...list[idx], phone, username: phone, password: generatedPassword }
          : { phone, username: phone, password: generatedPassword };

      if (idx >= 0) list[idx] = next;
      else list.push(next);

      localStorage.setItem(KEY, JSON.stringify(list));

      if (import.meta.env.DEV) {
        console.log("✅ userAccounts updated:", next);
      }

      savedRef.current = true; // فقط یک‌بار ذخیره کند
    } catch (e) {
      console.warn("localStorage update error:", e);
    }
  }, [paymentCompleted, recipientPhone, generatedPassword]);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    // شبیه‌سازی پرداخت
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    setPaymentCompleted(true);
    // مطابق فلوی قبلی پروژه:
    onPaymentComplete?.();
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

        {paymentCompleted && recipientPhone && generatedPassword && (
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
                  {generatedPassword}
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
