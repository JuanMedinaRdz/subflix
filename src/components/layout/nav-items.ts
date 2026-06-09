import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  CalendarDays,
  Settings,
  type LucideIcon
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// Single source of truth for primary navigation, shared by the desktop
// sidebar and the mobile bottom bar.
export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
