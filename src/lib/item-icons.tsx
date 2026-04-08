import type { LucideIcon } from "lucide-react";
import {
  BookMarked,
  BookOpen,
  Building2,
  CalendarHeart,
  CircleDot,
  Coins,
  Droplets,
  Flame,
  HandHeart,
  HeartHandshake,
  Languages,
  Link2,
  MapPin,
  MessageCircleWarning,
  Moon,
  Scale,
  Scroll,
  ScrollText,
  Shield,
  Sparkles,
  Sunrise,
  Sword,
  Users,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

/** Maps data `icon` keys to Lucide components — extend when adding new items */
const ICON_MAP: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  moon: Moon,
  "heart-handshake": HeartHandshake,
  sparkles: Sparkles,
  users: Users,
  shield: Shield,
  "message-circle-warning": MessageCircleWarning,
  link: Link2,
  "hand-heart": HandHeart,
  "map-pin": MapPin,
  swords: Sword,
  "book-marked": BookMarked,
  droplets: Droplets,
  scale: Scale,
  "building-2": Building2,
  wine: Wine,
  utensils: UtensilsCrossed,
  "calendar-heart": CalendarHeart,
  flame: Flame,
  "circle-dot": CircleDot,
  scroll: Scroll,
  "scroll-text": ScrollText,
  languages: Languages,
  coins: Coins,
  sunrise: Sunrise,
};

export function ItemIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && ICON_MAP[name]) || Sparkles;
  return <Icon className={className} aria-hidden />;
}
