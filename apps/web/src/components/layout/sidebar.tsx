"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CircleDollarSign,
  LogOut,
  Camera
} from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";

import { Trophy, BarChart3, Settings } from "lucide-react"; // add inside the imports

const routes = [
  {
    label: "Dashboard & IA",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-yellow-500",
  },
  {
    label: "CRM & Vendas",
    icon: Users,
    href: "/admin/alunos",
    color: "text-zinc-300",
  },
  {
    label: "Grade & Check-in",
    icon: CalendarDays,
    href: "/admin/aulas",
    color: "text-zinc-300",
  },
  {
    label: "Financeiro",
    icon: CircleDollarSign,
    href: "/admin/financeiro",
    color: "text-zinc-300",
  },
  {
    label: "Recepção (QR)",
    icon: Camera,
    href: "/admin/scanner",
    color: "text-zinc-300",
  },
  {
    label: "Campeonatos",
    icon: Trophy,
    href: "/admin/campeonatos",
    color: "text-zinc-300",
  },
  {
    label: "Loja Virtual",
    icon: LayoutDashboard, // Store icon
    href: "/admin/loja",
    color: "text-zinc-300",
  },
  {
    label: "Relatórios & Churn",
    icon: BarChart3,
    href: "/admin/relatorios",
    color: "text-zinc-300",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-950 text-white border-r border-zinc-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <BoxingGlove className="h-8 w-8 text-yellow-500 mr-2" />
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            Fight <span className="text-yellow-500">Hub</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="px-3 pb-4">
        <button
          onClick={async () => {
            const { logoutAction } = await import("@/actions/auth");
            const result = await logoutAction();
            if (result.success) {
              window.location.href = result.redirectUrl;
            }
          }}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Sair do Sistema
          </div>
        </button>
      </div>
    </div>
  );
};
