import React from "react";
import { ChevronLeft, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { OCCASIONS } from "../data/occasions";

type TileProps = { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ComponentType<any>; 
  label: string; 
};

function Tile({ active, onClick, icon: Icon, label }: TileProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-right transition-all hover:shadow-md ${
        active ? "border-transparent ring-2 ring-offset-2 bg-gradient-to-br from-[#0095da] to-[#ff4f00] text-white" : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-white/20" : "bg-neutral-100"}`}>
          {Icon ? <Icon className={active ? "text-white" : "text-neutral-700"} size={20} /> : null}
        </div>
        <div className="flex-1">
          <div className={`font-[600] ${active ? "text-white" : "text-neutral-800"}`}>{label}</div>
          {!active && <div className="text-xs text-neutral-500">انتخاب</div>}
        </div>
        <ChevronLeft className={active ? "text-white" : "text-neutral-400"} />
      </div>
    </button>
  );
}

type OccasionPickerProps = {
  occasion: string;
  customOccasion: string;
  onOccasionChange: (occasion: string) => void;
  onCustomOccasionChange: (customOccasion: string) => void;
  onNext: () => void;
};

export function OccasionPicker({ 
  occasion, 
  customOccasion, 
  onOccasionChange, 
  onCustomOccasionChange, 
  onNext 
}: OccasionPickerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {OCCASIONS.map((o) => (
          <Tile 
            key={o.key} 
            active={occasion === o.key} 
            onClick={() => onOccasionChange(o.key)} 
            icon={o.icon} 
            label={o.label} 
          />
        ))}
      </div>
      {occasion === "custom" && (
        <Input 
          placeholder="نام بهانه دلخواه (مثلاً: قبولی کنکور)" 
          value={customOccasion} 
          onChange={(e) => onCustomOccasionChange(e.target.value)} 
          className="rounded-xl" 
        />
      )}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Wand2 size={18} /> می‌توانید بعداً هم تغییر دهید.
        </div>
        <Button onClick={onNext} className="rounded-xl">
          ادامه <ChevronLeft className="mr-1" size={18} />
        </Button>
      </div>
    </div>
  );
}