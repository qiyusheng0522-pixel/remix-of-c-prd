import {
  Soup,
  Egg,
  Fish,
  Wheat,
  Cookie,
  Salad,
  Carrot,
  Apple,
  Beef,
  Drumstick,
  Croissant,
  Pizza,
  IceCream2,
  Coffee,
  Sandwich,
  Sun,
  Moon,
  Sunrise,
  Home,
  Pill,
  Droplet,
  Heart,
  Stethoscope,
  Activity,
  Footprints,
  PersonStanding,
  Dumbbell,
  BookOpen,
  Users,
  MessageCircle,
  Phone,
  Camera,
  Sparkles,
  Award,
  Trophy,
  Medal,
  Crown,
  Gift,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  Bell,
  Mail,
  Send,
  Flower2,
  Leaf,
  Mountain,
  Hospital,
  Utensils,
  UtensilsCrossed,
  Bird,
  Cat,
  Flame,
  Image as ImageIcon,
  Watch,
  Briefcase,
  Backpack,
  Palette,
  Music2,
  Tv,
  ClipboardList,
  HeartPulse,
  CircleUser,
  User,
  Hand,
  CircleDot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Map common emoji characters used across the app to Lucide icons,
 * so that we can replace pictographic content with a consistent icon set.
 */
const EMOJI_MAP: Record<string, LucideIcon> = {
  // 食物 / 餐别
  "🥣": Soup,
  "🍲": Soup,
  "🍵": Coffee,
  "🍱": UtensilsCrossed,
  "🥗": Salad,
  "🥬": Leaf,
  "🥦": Leaf,
  "🥚": Egg,
  "🍞": Croissant,
  "🍳": Egg,
  "🐟": Fish,
  "🍤": Fish,
  "🍚": Wheat,
  "🌰": Cookie,
  "🫐": Apple,
  "🍎": Apple,
  "🥛": Coffee,
  "🥩": Beef,
  "🍗": Drumstick,
  "🍰": Cookie,
  "🍪": Cookie,
  "🍕": Pizza,
  "🍦": IceCream2,
  "🥪": Sandwich,
  "☕": Coffee,
  "🍶": Wallet,
  "🍽": Utensils,
  "🍽️": Utensils,
  "🛢": Droplet,
  "🛢️": Droplet,
  "🧂": CircleDot,

  // 时间 / 自然
  "🌅": Sunrise,
  "☀": Sun,
  "☀️": Sun,
  "🌙": Moon,
  "🌿": Leaf,
  "🌸": Flower2,
  "🌈": Palette,
  "⛰": Mountain,
  "⛰️": Mountain,

  // 身体 / 医护
  "🩸": Droplet,
  "💊": Pill,
  "🩺": Stethoscope,
  "❤": Heart,
  "❤️": Heart,
  "💚": HeartPulse,
  "💪": Dumbbell,
  "🚶": Footprints,
  "🚶‍♀️": Footprints,
  "🏃": Footprints,
  "🧘": PersonStanding,
  "🧘‍♀️": PersonStanding,
  "💃": Music2,
  "🔥": Flame,

  // 人物 / 角色
  "👵": User,
  "👴": User,
  "🧓": User,
  "👨‍⚕️": Stethoscope,
  "👩‍⚕️": Stethoscope,
  "👩‍🦳": User,
  "👩‍🍳": Utensils,
  "👨‍🍳": Utensils,
  "👩‍🏫": BookOpen,

  // 物品 / 场景
  "🏡": Home,
  "🏥": Hospital,
  "💆": Hand,
  "💬": MessageCircle,
  "📖": BookOpen,
  "📋": ClipboardList,
  "📊": Activity,
  "📈": Activity,
  "📸": Camera,
  "📷": Camera,
  "📷️": Camera,
  "📞": Phone,
  "📨": Mail,
  "✉": Mail,
  "✉️": Mail,
  "🎥": Tv,
  "🎯": Award,
  "🎁": Gift,
  "🛒": ShoppingCart,
  "👜": ShoppingBag,
  "⌚": Watch,
  "💰": Wallet,
  "🐧": Bird,
  "🐱": Cat,

  // 奖励 / 标记
  "⭐": Award,
  "🥇": Medal,
  "🥈": Medal,
  "🥉": Medal,
  "🏆": Trophy,
  "🎉": Sparkles,
  "✨": Sparkles,

  // 杂项
  "☁": Sparkles,
  "☁️": Sparkles,
};

const FALLBACK = Sparkles;

/**
 * Render a Lucide icon by emoji character.
 * Falls back to a Sparkles icon when the emoji is not mapped.
 */
export function EmojiIcon({
  emoji,
  className,
  strokeWidth,
}: {
  emoji: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = EMOJI_MAP[emoji] ?? FALLBACK;
  return <Icon className={cn("h-5 w-5", className)} strokeWidth={strokeWidth} />;
}

export function getEmojiIcon(emoji: string): LucideIcon {
  return EMOJI_MAP[emoji] ?? FALLBACK;
}