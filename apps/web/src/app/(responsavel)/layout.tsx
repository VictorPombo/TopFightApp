import { Topbar } from "@/components/layout/topbar";

export default function ResponsavelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative bg-zinc-50 dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="h-20 fixed w-full z-50">
        <Topbar />
      </div>
      <main className="pt-24 p-4 md:p-8 max-w-5xl mx-auto h-full">
        {children}
      </main>
    </div>
  );
}
