"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useState, useEffect } from "react";

export const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-slate-900" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-slate-900">
        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
