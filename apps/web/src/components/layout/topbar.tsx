"use client";

import { MobileSidebar } from "./mobile-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Topbar = () => {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-black shadow-sm border-b border-zinc-200 dark:border-zinc-800 h-full transition-colors">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          <div className="flex items-center gap-x-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">Mestre Splinter</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">admin@fighthub.com</p>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};
