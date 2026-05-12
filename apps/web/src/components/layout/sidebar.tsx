"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CircleDollarSign,
  Dumbbell,
  LogOut
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    label: "Alunos",
    icon: Users,
    href: "/admin/alunos",
    color: "text-violet-500",
  },
  {
    label: "Grade de Aulas",
    icon: CalendarDays,
    href: "/admin/aulas",
    color: "text-pink-700",
  },
  {
    label: "Financeiro",
    icon: CircleDollarSign,
    href: "/admin/financeiro",
    color: "text-emerald-500",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-950 text-white border-r border-zinc-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <Dumbbell className="h-8 w-8 text-yellow-500 mr-2" />
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
