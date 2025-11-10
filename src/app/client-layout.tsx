'use client';
import { AppLayout } from '@/components/app-layout';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}