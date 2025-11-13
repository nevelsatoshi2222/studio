'use client';

import React from 'react';
import AppLayout from '@/components/app-layout';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAppRoute = !['/login', '/register'].includes(pathname) && !pathname.startsWith('/admin/login');

  if (isAppRoute) {
    return <AppLayout>{children}</AppLayout>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {children}
    </main>
  );
}
