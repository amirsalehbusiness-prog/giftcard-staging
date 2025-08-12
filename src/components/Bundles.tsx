import React from "react";
import { ChevronLeft, ChevronRight, Wifi, Phone, ShoppingBag, Plane, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { INTERNET_PACKS, VOICE_PACKS, DIGIKALA_VOUCHERS, FLYTODAY_VOUCHERS } from "../data/packages";
import { formatPrice } from "../utils/pricing";

type ChipProps = { 
  selected: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
};
 
function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-3 py-1.5 text-sm transition ${
        selected ? "bg-[#0095da] text-white border-transparent" : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {children}
    </button>
  );
}

type BundlesProps = {
  internet: string | null;
  voice: string | null;
  dkVoucher: string | null;
  ftVoucher: string | null;
  totalPrice: number;
  onInternetChange: (internet: string | null) => void;
  onVoiceChange: (voice: string | null) => void;
  onDkVoucherChange: (dkVoucher: string | null) => void;
  onFtVoucherChange: (ftVoucher: string | null) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function Bundles({
  internet,
  voice,
  dkVoucher,
  ftVoucher,
  totalPrice,
  onInternetChange,
  onVoiceChange,
  onDkVoucherChange,
  onFtVoucherChange,
  onNext,
  onPrevious
}: BundlesProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Wifi size={18} /> بسته اینترنت (گیگابایت)
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERNET_PACKS.map((p) => (
            <Chip 
              key={p.id} 
              selected={internet === p.id} 
              onClick={() => onInternetChange(internet === p.id ? null : p.id)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Phone size={18} /> بسته مکالمه
        </div>
        <div className="flex flex-wrap gap-2">
          {VOICE_PACKS.map((p) => (
            <Chip 
              key={p.id} 
              selected={voice === p.id} 
              onClick={() => onVoiceChange(voice === p.id ? null : p.id)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold flex items-center gap-2">
          <ShoppingBag size={18} /> ووچر خرید دیجی‌کالا
        </div>
        <div className="flex flex-wrap gap-2">
          {DIGIKALA_VOUCHERS.map((p) => (
            <Chip 
              key={p.id} 
              selected={dkVoucher === p.id} 
              onClick={() => onDkVoucherChange(dkVoucher === p.id ? null : p.id)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Plane size={18} /> ووچر سفر (فلای‌تودی)
        </div>
        <div className="flex flex-wrap gap-2">
          {FLYTODAY_VOUCHERS.map((p) => (
            <Chip 
              key={p.id} 
              selected={ftVoucher === p.id} 
              onClick={() => onFtVoucherChange(ftVoucher === p.id ? null : p.id)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* نمایش قیمت کل */}
      {totalPrice > 0 && (
        <div className="rounded-2xl border bg-gradient-to-r from-emerald-50 to-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Calculator size={18} /> مجموع قیمت:
            </div>
            <div className="text-xl font-bold text-emerald-800">
              {formatPrice(totalPrice)} تومان
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between">
        <Button variant="outline" className="rounded-xl" onClick={onPrevious}>
          <ChevronRight className="ml-1" size={18} /> قبلی
        </Button>
        <Button onClick={onNext} className="rounded-xl">
          ادامه <ChevronLeft className="mr-1" size={18} />
        </Button>
      </div>
    </div>
  );
}