"use client";

// NOTE: Component for the MOBILE layer only. Currently UNWIRED (not rendered
// anywhere) — see the mobile/desktop layer-separation plan. Adding it to a
// page/layout is the next step, AFTER desktop verification.
//
// Desktop is NOT affected by this component.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Stethoscope,
  Building2,
  CalendarHeart,
  User,
} from "lucide-react";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/doctors", label: "Doctors", Icon: Stethoscope },
  { href: "/hospitals", label: "Hospitals", Icon: Building2 },
  { href: "/my-appointments", label: "Appointments", Icon: CalendarHeart },
  { href: "/my-profile", label: "Profile", Icon: User },
];

const MobileTabBar = () => {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <nav className="mobile-tabbar md:hidden">
      <div className="flex items-end justify-around h-[64px]">
        {tabs.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 pt-2 pb-1.5 touch-none-outline"
            >
              <span
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  active ? "text-[#179E8D] -translate-y-0.5" : "text-[#8a94a3]"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.9} />
                {active && (
                  <span className="absolute -bottom-2.5 w-1 h-1 rounded-full bg-[#179E8D]" />
                )}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-[#179E8D]" : "text-[#8a94a3]"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;