import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-zinc-50 dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full">
        <div className="h-20 fixed w-full md:w-[calc(100%-18rem)] z-50">
          <Topbar />
        </div>
        <div className="pt-24 p-4 md:p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
