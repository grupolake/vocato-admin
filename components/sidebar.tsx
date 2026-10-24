"use client";

import {
  BookOpen,
  Briefcase,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Link2,
  Receipt,
  School,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Visão geral", icon: LayoutDashboard },
  { href: "/questionarios", label: "Questionários", icon: HelpCircle },
  { href: "/ocupacoes", label: "Ocupações", icon: Briefcase },
  { href: "/cursos", label: "Cursos", icon: BookOpen },
  { href: "/faculdades", label: "Faculdades", icon: School },
  { href: "/ofertas", label: "Ofertas", icon: Link2 },
  { href: "/orders", label: "Orders", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-1 border-r border-line-subtle bg-card p-4 md:flex">
      <div className="mb-6 flex h-10 items-center gap-2 px-3">
        <GraduationCap size={22} className="text-brand" />
        <span className="font-extrabold tracking-tight text-strong">
          Vocato <span className="lf-eyebrow">admin</span>
        </span>
      </div>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-[12px] px-3 text-[14.5px] font-semibold no-underline transition-colors ${
              active
                ? "bg-[var(--lake-50)] text-[var(--lake-700)]"
                : "text-secondary hover:bg-sunken"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
