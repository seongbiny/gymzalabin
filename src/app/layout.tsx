import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: 'gymzalabin — 운동 로그 대시보드',
  description: 'Notion CMS 기반 웨이트 & 러닝 기록 대시보드',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-[family-name:var(--font-noto-sans-kr)]">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
