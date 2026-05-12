"use client";

import { useEffect, useState } from "react";
import { MobileSidebar } from "./mobile-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getMyAcademyAction } from "@/actions/academy";

export const Topbar = () => {
  const [academyName, setAcademyName] = useState("Fight Hub");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getMyAcademyAction().then((result) => {
      if (result.success && result.academy) {
        setAcademyName(result.academy.name);
      }
    });
  }, []);

  return (
    <div className="flex items-center p-4 bg-white dark:bg-black shadow-sm border-b border-zinc-200 dark:border-zinc-800 h-full transition-colors">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          <div className="flex items-center gap-x-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">{academyName}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Administrador</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-yellow-500 text-black font-black">
                {academyName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};
