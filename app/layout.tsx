import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import AuthContext from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'みんなで遊ぼうクイズアプリ',
  description: 'リアルタイムで遊べるようになる予定のクイズアプリです',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} pt-16 min-h-screen w-full`}>
        <AuthContext>
          <Theme>
            {children}
          </Theme>
        </AuthContext>
      </body>
    </html>
  );
}
