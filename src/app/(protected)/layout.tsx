import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen sm:!pl-64 w-full">
        <Topbar />
        <main className="!mt-20 flex-1 !p-6 lg:!p-10 w-full !max-w-[1600px] !mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
