'use client';
import AppLayout from '@/components/app-layout';
import { usePathname } from 'next/navigation';

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // We only want the main app layout for routes inside the app, not for login/register
  const isAppRoute = !['/login', '/register'].includes(pathname) && !pathname.startsWith('/admin/login');

  if (isAppRoute) {
    return <AppLayout>{children}</AppLayout>;
  }

  // For routes like /login, just render the children without the full dashboard layout
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {children}
    </main>
  );
}
