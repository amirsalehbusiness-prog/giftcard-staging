import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { OccasionPicker } from "./OccasionPicker";
import { MessageForm } from "./MessageForm";
import { Bundles } from "./Bundles";
import { ReviewCard } from "./ReviewCard";
import type { WizardData, StepInfo } from "../types";
 
const STEPS: StepInfo[] = [
  { key: "occasion", title: "انتخاب بهانه (تم)" },
  { key: "message", title: "پیام و مشخصات" },
  { key: "bundles", title: "انتخاب بسته‌ها" },
  { key: "review", title: "مرور و کارت دیجیتال" },
];

type WizardProps = {
  step: number;
  data: WizardData;
  totalPrice: number;
  messagePlaceholder: string;
  isPaid: boolean;
  onStepChange: (step: number) => void;
  onDataChange: (data: Partial<WizardData>) => void;
  onPaymentComplete?: () => void;
};

export function Wizard({ 
  step, 
  data, 
  totalPrice, 
  messagePlaceholder, 
  isPaid,
  onStepChange, 
  onDataChange,
  onPaymentComplete
}: WizardProps) {
  return (
    <Card className="rounded-2xl w-full">
      <CardHeader>
        <CardTitle className="text-xl">ویزارد هدیه</CardTitle>
        <CardDescription>در چند قدم ساده، هدیه‌ی دیجیتال یا فیزیکی خود را بسازید.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 lg:gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 whitespace-nowrap">
              <button
                className={`rounded-full px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm border transition ${
                  i === step ? "bg-[#0095da] text-white border-transparent" : "bg-white text-neutral-700 border-neutral-200"
                }`}
                onClick={() => onStepChange(i)}
              >
                <span className="hidden lg:inline">{i + 1}. {s.title}</span>
                <span className="lg:hidden">{i + 1}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronLeft className="text-neutral-300 hidden lg:inline" size={18} />}
              {i < STEPS.length - 1 && <ChevronLeft className="text-neutral-300 lg:hidden" size={14} />}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="s0" 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -8 }}
            >
              <OccasionPicker
                occasion={data.occasion ?? ""}
                customOccasion={data.customOccasion}
                onOccasionChange={(occasion) => onDataChange({ occasion })}
                onCustomOccasionChange={(customOccasion) => onDataChange({ customOccasion })}
                onNext={() => onStepChange(1)}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="s1" 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -8 }}
            >
              <MessageForm
                recipientName={data.recipientName}
                recipientPhone={data.recipientPhone}
                senderPhone={data.senderPhone}
                senderName={data.senderName}
                message={data.message ?? ""}
                oneYear={data.oneYear}
                messagePlaceholder={messagePlaceholder}
                onRecipientNameChange={(recipientName) => onDataChange({ recipientName })}
                onRecipientPhoneChange={(recipientPhone) => onDataChange({ recipientPhone })}
                onSenderPhoneChange={(senderPhone) => onDataChange({ senderPhone })}
                onSenderNameChange={(senderName) => onDataChange({ senderName })}
                onMessageChange={(message) => onDataChange({ message })}
                onOneYearChange={(oneYear) => onDataChange({ oneYear })}
                onNext={() => onStepChange(2)}
                onPrevious={() => onStepChange(0)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="s2" 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -8 }}
            >
              <Bundles
                internet={data.internet}
                voice={data.voice}
                dkVoucher={data.dkVoucher}
                ftVoucher={data.ftVoucher}
                totalPrice={totalPrice}
                onInternetChange={(internet) => onDataChange({ internet })}
                onVoiceChange={(voice) => onDataChange({ voice })}
                onDkVoucherChange={(dkVoucher) => onDataChange({ dkVoucher })}
                onFtVoucherChange={(ftVoucher) => onDataChange({ ftVoucher })}
                onNext={() => onStepChange(3)}
                onPrevious={() => onStepChange(1)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="s3" 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -8 }}
            >
              <ReviewCard
                occasion={data.occasion ?? ""}
                customOccasion={data.customOccasion}
                recipientName={data.recipientName}
                recipientPhone={data.recipientPhone}
              senderPhone={data.senderPhone}
                senderName={data.senderName}
               message={data.message ?? ""}
                internet={data.internet}
                voice={data.voice}
                dkVoucher={data.dkVoucher}
                ftVoucher={data.ftVoucher}
                oneYear={data.oneYear}
                totalPrice={totalPrice}
                isPaid={isPaid}
                onPrevious={() => onStepChange(2)}
                onPaymentComplete={onPaymentComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}