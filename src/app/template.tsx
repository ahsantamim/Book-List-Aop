'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = !pathname?.startsWith('/auth');

  return (
    <div className="min-h-full flex flex-col bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
