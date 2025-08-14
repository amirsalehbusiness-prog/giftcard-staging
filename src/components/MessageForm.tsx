import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

type MessageFormProps = {
  recipientName: string;
  recipientPhone: string | null;
  senderPhone: string | null;
  senderName: string;
  message: string;
  oneYear: boolean;
  onRecipientNameChange: (name: string) => void;
  onRecipientPhoneChange: (phone: string) => void;
  onSenderPhoneChange: (phone: string) => void;
  onSenderNameChange: (name: string) => void;
  onMessageChange: (message: string) => void;
  onOneYearChange: (oneYear: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  messagePlaceholder: string;
};

export function MessageForm({
  recipientName,
  recipientPhone,
  senderPhone,
  senderName,
  message,
  oneYear,
  onRecipientNameChange,
  onRecipientPhoneChange,
  onSenderPhoneChange,
  onSenderNameChange,
  onMessageChange,
  onOneYearChange,
  onNext,
  onPrevious,
  messagePlaceholder
}: MessageFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-sm mb-1">نام گیرنده</div>
          <Input 
            value={recipientName} 
            onChange={(e) => onRecipientNameChange(e.target.value)} 
            placeholder="مثلاً: علی" 
            className="rounded-xl" 
          />
        </div>
        <div>
          <div className="text-sm mb-1">شماره موبایل گیرنده</div>
          <Input 
            value={recipientPhone ?? ""} 
            onChange={(e) => onRecipientPhoneChange(e.target.value)} 
            placeholder="مثلاً: 09123456789" 
            className="rounded-xl" 
            type="tel"
            maxLength={11}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <div className="text-sm mb-1">نام فرستنده</div>
          <Input 
            value={senderName} 
            onChange={(e) => onSenderNameChange(e.target.value)} 
            placeholder="مثلاً: زهرا" 
            className="rounded-xl" 
          />
        </div>
        <div>
          <div className="text-sm mb-1">شماره موبایل فرستنده</div>
          <Input 
            value={senderPhone ?? ""} 
            onChange={(e) => onSenderPhoneChange(e.target.value)} 
            placeholder="مثلاً: 09987654321" 
            className="rounded-xl" 
            type="tel"
            maxLength={11}
          />
        </div>
      </div>
      <div>
        <div className="text-sm mb-1">پیام تبریک</div>
        <Textarea 
          value={message} 
          onChange={(e) => onMessageChange(e.target.value)} 
          rows={4} 
          className="rounded-xl"
          placeholder={messagePlaceholder}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={oneYear} onCheckedChange={onOneYearChange} id="oneyear" />
        <label htmlFor="oneyear" className="text-sm">اعتبار بسته‌ها: یک‌ساله</label>
      </div>
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