import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RagInitializer } from '@/components/rag-initializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WL8 Indicator Builder',
  description: 'Create, test, and deploy custom indicators for Wealth-Lab 8 with intelligent assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <RagInitializer />
        {children}
      </body>
    </html>
  );
}
