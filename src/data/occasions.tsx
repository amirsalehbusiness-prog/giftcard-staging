import React from "react";
import {
  Cake,
  Crown,
  Heart,
  Baby,
  Users,
  GraduationCap,
  Landmark,
  PartyPopper,
  Flower2,
  Wand2,
  Star,
  Sparkles,
} from "lucide-react";
import type { OccasionItem } from "../types";

// Helper icon for Engineer occasion
function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path
        fill="currentColor"
        d="M22 19.59 13.41 11A6 6 0 0 0 7 4c0-.34.02-.67.07-1A8 8 0 0 1 19 13a6 6 0 0 1-1 3.41L26 24l-2 2-2-2 0 0-0-0L19.59 22A6 6 0 0 1 16 23a6 6 0 0 1-3.41-1.59L4.41 13.24 6 11.66l7.17 7.17A4 4 0 0 0 16 20a4 4 0 0 0 4-4 4 4 0 0 0-.34-1.63L22 19.59Z"
      />
    </svg>
  );
}

export const OCCASIONS: OccasionItem[] = [
  { 
    key: "birthday", 
    label: "روز تولد", 
    icon: Cake, 
    gradient: "from-[#0095da] to-[#7dd3fc]",
    theme: {
      primary: "#0095da",
      secondary: "#7dd3fc", 
      accent: "#ff4f00",
      pattern: "🎂",
      decorativeElements: [Star, Sparkles],
      message: "تولدت مبارک! برات یک سال پر از شادی و حال خوب آرزو می‌کنم 🎉"
    }
  },
  { 
    key: "father", 
    label: "روز پدر", 
    icon: Crown, 
    gradient: "from-[#0095da] to-[#ff4f00]",
    theme: {
      primary: "#0095da",
      secondary: "#ff4f00",
      accent: "#fbbf24",
      pattern: "👑",
      decorativeElements: [Crown, Star],
      message: "روز پدر مبارک! ممنون که همیشه پشتیبان و راهنمای ما هستی 👨‍👧‍👦"
    }
  },
  { 
    key: "mother", 
    label: "روز مادر", 
    icon: Heart, 
    gradient: "from-[#ff4f00] to-[#ffaf7a]",
    theme: {
      primary: "#ff4f00",
      secondary: "#ffaf7a",
      accent: "#f97316",
      pattern: "💐",
      decorativeElements: [Heart, Flower2],
      message: "روز مادر مبارک! عشق و محبت بی‌پایانت نور زندگی ماست 💕"
    }
  },
  { 
    key: "woman", 
    label: "روز زن", 
    icon: Flower2, 
    gradient: "from-[#ff4f00] to-pink-400",
    theme: {
      primary: "#ff4f00",
      secondary: "#f472b6",
      accent: "#ec4899",
      pattern: "🌸",
      decorativeElements: [Flower2, Sparkles],
      message: "روز زن مبارک! قدر و عزت شما بی‌نهایت است 🌺"
    }
  },
  { 
    key: "girl", 
    label: "روز دختر", 
    icon: Baby, 
    gradient: "from-pink-500 to-[#0095da]",
    theme: {
      primary: "#ec4899",
      secondary: "#0095da",
      accent: "#f97316",
      pattern: "🎀",
      decorativeElements: [Heart, Star],
      message: "روز دختر مبارک! آینده روشن و پر امیدی در انتظارته 🌟"
    }
  },
  { 
    key: "student", 
    label: "روز دانشجو", 
    icon: GraduationCap, 
    gradient: "from-indigo-500 to-[#0095da]",
    theme: {
      primary: "#6366f1",
      secondary: "#0095da",
      accent: "#3b82f6",
      pattern: "📚",
      decorativeElements: [GraduationCap, Star],
      message: "روز دانشجو مبارک! علم و دانش راه رسیدن به آرزوهاست 🎓"
    }
  },
  { 
    key: "teacher", 
    label: "روز معلم", 
    icon: Landmark, 
    gradient: "from-emerald-500 to-[#0095da]",
    theme: {
      primary: "#10b981",
      secondary: "#0095da",
      accent: "#059669",
      pattern: "🍎",
      decorativeElements: [Landmark, Star],
      message: "روز معلم مبارک! شما سازنده آینده و پرورش‌دهنده نسل‌ها هستید 🌱"
    }
  },
  { 
    key: "engineer", 
    label: "روز مهندس", 
    icon: WrenchIcon, 
    gradient: "from-sky-500 to-emerald-400",
    theme: {
      primary: "#0ea5e9",
      secondary: "#34d399",
      accent: "#06b6d4",
      pattern: "⚙️",
      decorativeElements: [WrenchIcon, Star],
      message: "روز مهندس مبارک! خلاقیت و نوآوری شما جهان را می‌سازد 🔧"
    }
  },
  { 
    key: "youth", 
    label: "روز جوان", 
    icon: Users, 
    gradient: "from-[#0095da] to-emerald-400",
    theme: {
      primary: "#0095da",
      secondary: "#34d399",
      accent: "#10b981",
      pattern: "🚀",
      decorativeElements: [Users, Sparkles],
      message: "روز جوان مبارک! انرژی و امید شما آینده کشور است 💪"
    }
  },
  { 
    key: "nowruz", 
    label: "عید نوروز", 
    icon: PartyPopper, 
    gradient: "from-emerald-400 to-[#ff4f00]",
    theme: {
      primary: "#34d399",
      secondary: "#ff4f00",
      accent: "#10b981",
      pattern: "🌱",
      decorativeElements: [PartyPopper, Flower2],
      message: "نوروز پیروز! سال نو مبارک و پر از شادی و سلامتی 🌸"
    }
  },
  { 
    key: "love", 
    label: "سالگرد/عاشقانه", 
    icon: Heart, 
    gradient: "from-rose-500 to-[#ff4f00]",
    theme: {
      primary: "#f43f5e",
      secondary: "#ff4f00",
      accent: "#e11d48",
      pattern: "💕",
      decorativeElements: [Heart, Sparkles],
      message: "عشقم، هر روز کنارت مثل یک جشن است 💖"
    }
  },
  { 
    key: "custom", 
    label: "بهانه دلخواه", 
    icon: Wand2, 
    gradient: "from-zinc-700 to-zinc-500",
    theme: {
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#9ca3af",
      pattern: "✨",
      decorativeElements: [Wand2, Star],
      message: "تبریک می‌گم! امیدوارم این لحظه خاص رو به بهترین شکل جشن بگیری 🎉"
    }
  },
  { 
    key: "wedding", 
    label: "عروسی", 
    icon: Heart, 
    gradient: "from-pink-400 to-rose-500",
    theme: {
      primary: "#f472b6",
      secondary: "#f43f5e",
      accent: "#ec4899",
      pattern: "💒",
      decorativeElements: [Heart, Sparkles],
      message: "ازدواج مبارک! آرزوی زندگی پر از عشق و شادی برای شما 💕"
    }
  },
  { 
    key: "baby", 
    label: "تولد نوزاد", 
    icon: Baby, 
    gradient: "from-blue-300 to-pink-300",
    theme: {
      primary: "#93c5fd",
      secondary: "#f9a8d4",
      accent: "#60a5fa",
      pattern: "👶",
      decorativeElements: [Baby, Star],
      message: "تولد فرشته کوچولوتون مبارک! خدا نگهدارش باشه 👶"
    }
  },
];