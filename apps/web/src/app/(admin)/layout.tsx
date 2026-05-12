import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-slate-100">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-slate-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full">
        <div className="h-20 fixed w-full md:w-[calc(100%-18rem)] z-50">
          <Topbar />
        </div>
        <div className="pt-24 p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
