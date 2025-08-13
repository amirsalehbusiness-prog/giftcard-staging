import { useMemo, useState, useEffect } from "react";
import { Gift, Menu, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { UserProvider } from "./contexts/UserContext";

import { Wizard } from "./components/Wizard";
import { PreviewCard } from "./components/PreviewCard";
import { LoginPage } from "./components/LoginPage";
import { UserProfile } from "./components/UserProfile";

import { OCCASIONS } from "./data/occasions";
import { calculateTotalPrice } from "./utils/pricing";
import { APP_CONFIG } from "./utils/constants";
import type { WizardData } from "./types";



function AppContent() {
  const [currentPage, setCurrentPage] = useState<"home" | "login" | "profile">("home");
  const [step, setStep] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const [data, setData] = useState<WizardData>({
    occasion: "birthday",
    customOccasion: "",
    recipientName: "",
    recipientPhone: null, // ← مهم: nullable باشد
    senderName: "",
    message: "تولدت مبارک! برات یک سال پر از شادی و حال خوب آرزو می‌کنم 🎉",
    internet: null,
    voice: null,
    dkVoucher: null,
    ftVoucher: null,
    oneYear: true,
  });

  const selectedOccasion = useMemo(
    () => OCCASIONS.find((o) => o.key === data.occasion) || OCCASIONS[0],
    [data.occasion]
  );

  // پیام پیش‌فرض بر اساس مناسبت
  useEffect(() => {
    setData((prev) => ({ ...prev, message: selectedOccasion.theme.message }));
  }, [selectedOccasion]);

  // محاسبه قیمت کل
  const totalPrice = useMemo(
    () => calculateTotalPrice(data.internet, data.voice, data.dkVoucher, data.ftVoucher),
    [data.internet, data.voice, data.dkVoucher, data.ftVoucher]
  );

  const handleDataChange = (newData: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handlePaymentComplete = () => {
    setIsPaid(true);
  };

  // صفحه لاگین
  if (currentPage === "login") {
    return (
      <div dir="rtl" className="min-h-screen bg-neutral-50">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#0095da] flex items-center justify-center text-white">
                <Gift size={18} />
              </div>
              <div>
                <div className="text-sm text-neutral-500">{APP_CONFIG.COMPANY}</div>
                <div className="font-bold">{APP_CONFIG.NAME}</div>
              </div>
            </div>
            <Button variant="ghost" className="rounded-xl" onClick={() => setCurrentPage("home")}>
              بازگشت
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-md px-4 py-6">
          <LoginPage
            onLogin={(phone) => {
              // اگر خواستی اینجا هر کار اضافه انجام بده
              setCurrentPage("profile");
            }}
            onBackToHome={() => setCurrentPage("home")}
            onLoginSuccess={() => setCurrentPage("profile")}
          />
        </main>
      </div>
    );
  }

  // صفحه پروفایل
  if (currentPage === "profile") {
    return (
      <div dir="rtl" className="min-h-screen bg-neutral-50">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#0095da] flex items-center justify-center text-white">
                <Gift size={18} />
              </div>
              <div>
                <div className="text-sm text-neutral-500">{APP_CONFIG.COMPANY}</div>
                <div className="font-bold">{APP_CONFIG.NAME}</div>
              </div>
            </div>
            <Button variant="ghost" className="rounded-xl" onClick={() => setCurrentPage("home")}>
              بازگشت
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">
          <UserProfile onLogout={() => setCurrentPage("home")} />
        </main>
      </div>
    );
  }

  // صفحه اصلی (ویزارد + پیش‌نمایش)
  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-[#0095da] flex items-center justify-center text-white">
              <Gift size={18} />
            </div>
            <div>
              <div className="text-sm text-neutral-500">{APP_CONFIG.COMPANY}</div>
              <div className="font-bold">{APP_CONFIG.NAME}</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage("login")}
              className="text-sm font-medium text-neutral-700 hover:text-[#0095da] transition-colors"
            >
              ورود / ثبت‌نام
            </button>
            <a href="#" className="text-sm font-medium text-neutral-700 hover:text-[#0095da] transition-colors">
              مقالات
            </a>
            <a href="#" className="text-sm font-medium text-neutral-700 hover:text-[#0095da] transition-colors">
              تعامل کاربران
            </a>
            <a href="#" className="text-sm font-medium text-neutral-700 hover:text-[#0095da] transition-colors">
              درباره ما
            </a>
            <a href="#" className="text-sm font-medium text-neutral-700 hover:text-[#0095da] transition-colors">
              تماس با ما
            </a>
            <a href="#" className="text-sm font-medium text-neutral-700 hover:text-[#0095da] transition-colors">
              همکاری با ما
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Badge className="rounded-xl">نسخه نمایشی</Badge>
            <Button variant="outline" className="rounded-xl">
              راهنما
            </Button>

            {/* Debug */}
            <Button
              variant="ghost"
              className="rounded-xl text-xs"
              onClick={() => {
                const accounts = localStorage.getItem("userAccounts");
                console.log("🔍 localStorage userAccounts:", accounts);
                if (accounts) {
                  const parsed = JSON.parse(accounts);
                  console.log("📊 Parsed accounts:", parsed);
                  alert(`تعداد حساب‌ها: ${parsed.length}\n\nجزئیات در Console`);
                } else {
                  alert("هیچ حسابی یافت نشد!");
                }
              }}
            >
              🔍 Debug
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden rounded-xl p-2"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile overlay */}
        {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-[9998] lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

        {/* Mobile drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] lg:hidden border-r border-neutral-200 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 bg-gray-50 h-full w-full relative">
            <div className="absolute inset-0 bg-gray-50 -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#0095da] flex items-center justify-center text-white">
                  <Gift size={16} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500">{APP_CONFIG.COMPANY}</div>
                  <div className="font-bold text-sm">{APP_CONFIG.NAME}</div>
                </div>
              </div>
              <Button variant="ghost" className="rounded-xl p-2" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <nav className="space-y-1">
              <button
                className="w-full text-right px-4 py-3 text-sm font-medium text-neutral-800 hover:text-[#0095da] hover:bg-white rounded-xl transition-all duration-200 bg-gray-50"
                onClick={() => {
                  setCurrentPage("login");
                  setMobileMenuOpen(false);
                }}
              >
                ورود / ثبت‌نام
              </button>
              <a href="#" className="block px-4 py-3 text-sm font-medium text-neutral-800 hover:text-[#0095da] hover:bg-white rounded-xl transition-all duration-200 bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                مقالات
              </a>
              <a href="#" className="block px-4 py-3 text-sm font-medium text-neutral-800 hover:text-[#0095da] hover:bg-white rounded-xl transition-all duration-200 bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                تعامل کاربران
              </a>
              <a href="#" className="block px-4 py-3 text-sm font-medium text-neutral-800 hover:text-[#0095da] hover:bg-white rounded-xl transition-all duration-200 bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                درباره ما
              </a>
              <a href="#" className="block px-4 py-3 text-sm font-medium text-neutral-800 hover:text-[#0095da] hover:bg-white rounded-xl transition-all duration-200 bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                تماس با ما
              </a>
              <a href="#" className="block px-4 py-3 text-sm font-medium text-neutral-800 hover:text-[#0095da] hover:bg-white rounded-xl transition-all duration-200 bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                همکاری با ما
              </a>
            </nav>

            <div className="mt-8 pt-6 border-t border-neutral-200 bg-gray-50">
              <div className="space-y-3">
                <Button variant="outline" className="w-full rounded-xl bg-gray-50 hover:bg-white">
                  راهنما
                </Button>
                <Badge className="rounded-xl w-full justify-center bg-[#ff4f00]">نسخه نمایشی</Badge>
                <Badge className="rounded-xl w-full justify-center bg-[#ff4f00]">{APP_CONFIG.VERSION}</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wizard */}
        <div className="space-y-6 lg:max-w-none">
          <Wizard
            step={step}
            data={data}
            totalPrice={totalPrice}
            messagePlaceholder={selectedOccasion.theme.message}
            isPaid={isPaid}
            onStepChange={setStep}
            onDataChange={handleDataChange}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 lg:max-w-none">
       <PreviewCard
  occasion={data.occasion ?? "birthday"}   // ← تضمین کن همیشه string بدی
  customOccasion={data.customOccasion}
  recipientName={data.recipientName}
  recipientPhone={data.recipientPhone}
  senderName={data.senderName}
   message={data.message ?? ""} 
  internet={data.internet}
  voice={data.voice}
  dkVoucher={data.dkVoucher}
  ftVoucher={data.ftVoucher}
  oneYear={data.oneYear}
  totalPrice={totalPrice}
  isPaid={isPaid}
/>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-2 text-center text-xs text-neutral-500">
        این یک نمونه‌ی رابط کاربری است و هنوز به درگاه پرداخت، سیستم احراز و APIهای واقعی متصل نشده.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ErrorBoundary>
  );
}
