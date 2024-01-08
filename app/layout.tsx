import ProviderSet from '@/lib/provider-set';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

export const metadata: Metadata = {
  title: 'Haargos - HomeAssistant Monitoring Tool',
  description: 'Monitor your client instances with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <link rel="preconnect" href={process.env.NEXT_PUBLIC_PRELOAD_URL}></link>
      <body className={inter.className}>
        {' '}
        <ProviderSet>{children}</ProviderSet>
        <Analytics />
        <Toaster richColors />
      </body>
    </html>
  );
}
